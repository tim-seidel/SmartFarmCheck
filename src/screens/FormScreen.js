import React, { useState, useEffect, useCallback } from 'react'
import { View, Alert, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import NetInfo from '@react-native-community/netinfo'

import NoContentView from "../components/NoContentView"
import QuestionView from "../components/QuestionView"
import IconButton from '../components/IconButton'
import Strings from '../constants/Strings'
import { ContentText } from '../components/Text'
import Layout from '../constants/Layout'
import ToolbarButton from '../components/ToolbarButton'
import { useThemeProvider } from '../ThemeContext'
import { ConstantColors } from '../constants/Colors'
import RootView from '../components/RootView'
import { fetchQuestions } from '../store/actions/questions'
import { EVALUATIONSCREEN } from '../constants/Paths'

const FormScreen = props => {
    const { colorTheme } = useThemeProvider()

    const [mode, setMode] = useState('list')
    const [pagingIndex, setPagingIndex] = useState(0)
    const [formId, setFormId] = useState(0)

    const [isLoading, setIsLoading] = useState(false)
    const [hasNoNetwork, setHasNoNetwork] = useState(false)
    const [errorCode, setErrorCode] = useState(0)

    const dispatch = useDispatch()
    const questions = useSelector(state => state.questions.questions)

    useEffect(() => {
        checkAndLoadQuestions()
    }, [checkAndLoadQuestions])

    const checkAndLoadQuestions = useCallback(async () => {
        const netinfo = await NetInfo.fetch()
        if (netinfo.isConnected) {
            setIsLoading(true)
            try {
                await dispatch(fetchQuestions())
            } catch (err) {
                console.log(err)
                setErrorCode(err.status ?? -1)
            }
            setIsLoading(false)
        } else {
            setHasNoNetwork(true)
        }
    }, [dispatch])

    function retryHandler() {
        setErrorCode(0)
        setHasNoNetwork(false)
        checkAndLoadQuestions()
    }

    function inputChangeHandler(question, input, validity) {
        question.input = input
        question.validity = validity
    }

    function layoutChangeHandler() {
        setMode(mode => mode === 'list' ? 'single' : 'list')
    }

    function questionPagingHandler(toNext) {
        var qNext = toNext ? pagingIndex + 1 : pagingIndex - 1
        if (qNext < 0) {
            qNext = 0
        }

        const max = questions.length - 1
        if (qNext > max) {
            qNext = max
        }
        setPagingIndex(qNext)
    }

    console.log("FormScreen.render()", isLoading, hasNoNetwork, errorCode, questions.length)
    var contentView = null
    if (errorCode !== 0) {
        contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.form_loading_error + " (Fehlercode: " + errorCode + ")"} />
    } else if (isLoading) {
        contentView = <NoContentView icon="cloud-download" loading title={Strings.form_loading} />
    } else if (hasNoNetwork && questions.length === 0) {
        contentView = <NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.form_loading_no_network} />
    } else if (questions.length === 0) {
        contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.form_loading_empty} />
    } else {
        props.navigation.setOptions({
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={ToolbarButton}>
                    <Item key="option-layout" iconName="clipboard-text" title={Strings.form_layout_questions} onPress={layoutChangeHandler} />
                </HeaderButtons>
            )
        })

        var questionContent = null
        if (mode === 'list') {
            questionContent = (
                <View style={styles.listContainer}>
                    <FlatList
                        contentContainerStyle={styles.listContent}
                        data={questions}
                        renderItem={({ item, index }) =>
                            <QuestionView
                                index={index + 1}
                                questionId={item.uuid}
                                text={item.text}
                                description={item.description}
                                prefill={item.input}
                                validator={item.validator}
                                onInputChanged={(input, validity) => inputChangeHandler(item, input, validity)} />}
                        keyExtractor={item => item.uuid}
                    />
                </View>)
        } else if (mode === 'single') {
            const currentQuestion = questions[pagingIndex]
            const canNavigatePrevious = pagingIndex > 0
            const canNavigateNext = (pagingIndex < (questions.length - 1))

            questionContent = (
                <View style={styles.singleQuestionLayoutContainer}>
                    <QuestionView
                        questionId={currentQuestion.uuid}
                        text={currentQuestion.text}
                        description={currentQuestion.description}
                        prefill={currentQuestion.input}
                        validator={currentQuestion.validator}
                        onInputChanged={(input, validity) => inputChangeHandler(currentQuestion, input, validity)}
                        index={pagingIndex + 1}
                    />
                    <View style={styles.questionPagingRow}>
                        <TouchableOpacity activeOpacity={0.7} disabled={!canNavigatePrevious} onPress={() => { questionPagingHandler(false) }} style={canNavigatePrevious ? { ...styles.pagingButton, backgroundColor: colorTheme.primary } : styles.pagingButtonDisabled}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                <Icon
                                    name="chevron-left"
                                    size={24}
                                    color={colorTheme.textPrimaryContrast}>
                                </Icon>
                                <ContentText
                                    numberOfLines={1}
                                    lineBreakMode="tail"
                                    ellipsizeMode="tail"
                                    style={{ color: colorTheme.textPrimaryContrast }}>
                                    {Strings.form_paging_backwards}
                                </ContentText>
                            </View>
                        </TouchableOpacity>
                        <View style={{ ...styles.pageInfo, backgroundColor: colorTheme.primary }}><ContentText style={{ color: colorTheme.textPrimaryContrast }}>{pagingIndex + 1}/{questions.length}</ContentText></View>
                        <TouchableOpacity disabled={!canNavigateNext} activeOpacity={0.7} onPress={() => { questionPagingHandler(true) }} style={canNavigateNext ? { ...styles.pagingButton, backgroundColor: colorTheme.primary } : styles.pagingButtonDisabled}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                                <ContentText
                                    numberOfLines={1}
                                    lineBreakMode="tail"
                                    ellipsizeMode="tail"
                                    style={{ color: colorTheme.textPrimaryContrast }}>
                                    {Strings.form_paging_forwards}
                                </ContentText>
                                <Icon
                                    name="chevron-right"
                                    size={24}
                                    color={colorTheme.textPrimaryContrast}>
                                </Icon>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }

        contentView =
            <>
                {questionContent}
                <View style={mode === 'single' ? styles.optionsRowHalf : styles.optionsRow}>
                    <View style={styles.submitWrapper}>
                        <IconButton icon="chart-areaspline" text={Strings.form_calculate} onPress={calculateHandler}  ></IconButton>
                    </View>
                </View>
            </>
    }

    return (
        <RootView>
            {contentView}
        </RootView>
    )

    function resetHandler() {
        Alert.alert(Strings.form_dialog_confirm_reset_title, Strings.form_dialog_confirm_reset_content, [
            { text: Strings.cancel, style: "default" },
            { text: Strings.form_reset, onPress: () => {}, style: "destructive" }
        ],
            { cancelable: false })
        return
    }

    function calculateHandler() {
        const indiciesError = []
        const indiciesEmpty = []

        questions.forEach((q, index) => {
            if (q.validity === 'invalid') {
                indiciesError.push(index + 1)
            }
            if (!q.input) {
                indiciesEmpty.push(index + 1)
            }
        })

        //Check first if no input was given. 
        if (indiciesEmpty.length == questions.length) {
            Alert.alert(Strings.form_dialog_empty_title, Strings.form_dialog_empty_content, [
                { text: Strings.okay, onPress: () => console.log("Canceled sending"), style: "cancel" },
            ],
                { cancelable: false })
            return
        }

        if (indiciesError.length > 0) {
            Alert.alert(Strings.form_dialog_errors_title, Strings.form_dialog_errors_content + ' Fehlerhaft: (' + indiciesError.join(', ') + ')', [
                { text: Strings.okay, onPress: () => console.log("Canceled sending"), style: "cancel" },
            ],
                { cancelable: false })
            return
        }

        if (indiciesEmpty.length > 0) {
            Alert.alert(Strings.form_dialog_send_unfinished_title, Strings.form_dialog_send_unfinished_content + ' Unbeantwortet: (' + indiciesEmpty.join(', ') + ')', [
                { text: Strings.cancel, onPress: () => console.log("Canceled sending"), style: "cancel" },
                { text: Strings.form_send, onPress: () => gotoEvaluation(questions), style: "default" }
            ],
                { cancelable: false })
        } else {
            gotoEvaluation(questions)
        }
    }

    function gotoEvaluation(questions) {
        const send = []
        questions.forEach(q => {
            if (q.input) {
                send.push({ 'questionUUID': q.uuid, 'value': q.input })
            }
        })
        const data = JSON.stringify(send)
        props.navigation.navigate(EVALUATIONSCREEN, data)
    }
}

styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        width: "100%",
        maxWidth: 700, //Todo: better estimation
        alignSelf: "center"
    },
    listContent: {
        flexGrow: 1
    },
    singleQuestionLayoutContainer: {
        flex: 1,
        justifyContent: "space-between"
    },
    questionPagingRow: {
        flexDirection: "row",
        paddingHorizontal: 4,
        paddingTop: 4,
        marginHorizontal: 8,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6
    },
    pagingButton: {
        borderRadius: Layout.borderRadius,
        padding: 8,
        flex: 1
    },
    pagingButtonDisabled: {
        backgroundColor: ConstantColors.grey,
        borderRadius: Layout.borderRadius,
        padding: 8,
        flex: 1
    },
    pageInfo: {
        borderRadius: Layout.borderRadius,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 4,
        justifyContent: "center"
    },
    optionsRow: {
        flexDirection: "row",
        padding: 4,
        margin: 8,
        borderRadius: Layout.borderRadius
    },
    optionsRowHalf: {
        flexDirection: "row",
        padding: 4,
        marginHorizontal: 8,
        marginBottom: 8,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6
    },
    submitWrapper: {
        flex: 1
    }
})

export default FormScreen
