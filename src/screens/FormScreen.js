import React, { useState, useEffect } from 'react';
import { View, VirtualizedList, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';

import NoContentView from "../components/NoContentView";
import QuestionView from "../components/QuestionView";
import IconButton from '../components/IconButton';
import {ColorTheme} from'../constants/Colors';
import Strings from '../constants/Strings';
import { ContentText } from '../components/Text';
import Layout from '../constants/Layout';

const SFCHeaderButton = props => (
    <HeaderButton {...props} IconComponent={Icon} iconSize={24} color={ColorTheme.current.textPrimaryContrast} />
)

//TODO: Evaluate functional vs. class component
const FormScreen = props => {
    const [mode, setMode] = useState('list')
    const [questionState, setQuestionState] = useState({ isLoaded: false, error: null, errorCode: 0, questions: [] })
    const [pagingIndex, setPagingIndex] = useState(0)
    const [formId, setFormId] = useState(0)

    useEffect(() => {
        if (!questionState.isLoaded) {
            loadQuestions();
        }
    }, [questionState.isLoaded])

    function loadQuestions() {
        if (!questionState.isLoaded) {
            fetch('https://pas.coala.digital/v1/questions', {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
            })
                .then(response => response.json())
                .then(json => {
                    //Check for http errors
                    if(json.status && json.status != 200){
                        setQuestionState({isLoaded: true, error: json, errorCode: json.status ?? -1, questions: []})
                    }else{
                        //Otherwise asumed as correct (A valid server response doesn't return a 200, sadly)
                        setQuestionState({ isLoaded: true, error: null, errorCode: 0, questions: json })
                    }
                })
                .catch(error => {
                    console.log("Error", error)
                    setQuestionState(qs => ({ isLoaded: true, error: error, errorCode: -1, questions: qs.questions }))
                })
        }
    }

    function retryHandler() {
        setQuestionState({ isLoaded: false, error: null, errorCode: 0, questions: [] })
    }

    function inputChangeHandler(question, input, validity) {
        question.input = input
        question.validity = validity
    }

    function layoutChangeHandler() {
        setMode(mode => mode === 'list' ? 'single' : 'list')
    }

    function questionPagingHandler(toNext) {
        var qNext = toNext ? pagingIndex + 1 : pagingIndex - 1;
        if (qNext < 0) {
            qNext = 0
        }

        const max = questionState.questions.length - 1
        if (qNext > max) {
            qNext = max
        }
        setPagingIndex(qNext)
    } 

    const { isLoaded, error, errorCode, questions } = questionState;
    console.log("FormScreen.render()", isLoaded, error, errorCode, questions.length)
    if (error) {
        return <View style={styles.container}><NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.form_loading_error+ " (Fehlercode: " + errorCode + ")"}></NoContentView></View>
    } else if (!isLoaded) {
        return <View style={styles.container}><NoContentView icon="cloud-download" loading title={Strings.form_loading}></NoContentView></View>
    } else if (questions.length === 0) {
        return <View style={styles.container}><NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.form_loading_empty}></NoContentView></View>
    } else {
        props.navigation.setOptions({
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={SFCHeaderButton}>
                    <Item key="option-layout" iconName="clipboard-text" title={Strings.form_layout_questions} onPress={layoutChangeHandler} />
                    <Item key="option-reset" iconName="delete" title={Strings.form_reset} onPress={resetHandler} />
                </HeaderButtons>
            )
        })

        var questionContent = null;
        if (mode === 'list') {
            questionContent = (
                <View style={styles.listContainer}>
                    <VirtualizedList
                        contentContainerStyle={styles.listContent}
                        data={questions}
                        renderItem={({ item, index }) => <QuestionView formId={formId} onInputChanged={(input, validity) => inputChangeHandler(item, input, validity)} index={index + 1} question={item} key={item.uuid} />}
                        keyExtractor={item => item.uuid}
                        getItemCount={() => questions.length}
                        getItem={(data, index) => { return questions[index] }}
                    />
                </View>)
        } else if (mode === 'single') {
            const currentQuestion = questions[pagingIndex]
            const canNavigatePrevious = pagingIndex > 0
            const canNavigateNext = (pagingIndex < (questions.length - 1))

            questionContent = (
                <View style={styles.singleQuestionLayoutContainer}>
                    <QuestionView formId={formId} onInputChanged={(input, validity) => inputChangeHandler(currentQuestion, input, validity)} index={pagingIndex + 1} question={currentQuestion} />
                    <View style={styles.questionPagingRow}>
                        <TouchableOpacity activeOpacity={0.7} disabled={!canNavigatePrevious} onPress={() => { questionPagingHandler(false) }} style={canNavigatePrevious ? styles.pagingButton : styles.pagingButtonDisabled}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start" }}>
                                <Icon
                                    name="chevron-left"
                                    size={24}
                                    color={ColorTheme.current.textPrimaryContrast}>
                                </Icon>
                                <ContentText
                                    numberOfLines={1}
                                    lineBreakMode="tail"
                                    ellipsizeMode="tail"
                                    style={{ color: ColorTheme.current.textPrimaryContrast }}>
                                    {Strings.form_paging_backwards}
                                    </ContentText>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.pageInfo}><ContentText  style={{ color: ColorTheme.current.textPrimaryContrast }}>{pagingIndex + 1}/{questions.length}</ContentText></View>
                        <TouchableOpacity disabled={!canNavigateNext} activeOpacity={0.7} onPress={() => { questionPagingHandler(true) }} style={canNavigateNext ? styles.pagingButton : styles.pagingButtonDisabled}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                                <ContentText
                                    numberOfLines={1}
                                    lineBreakMode="tail"
                                    ellipsizeMode="tail"
                                    style={{ color: ColorTheme.current.textPrimaryContrast }}>
                                    {Strings.form_paging_forwards}
                                    </ContentText>
                                <Icon
                                    name="chevron-right"
                                    size={24}
                                    color={ColorTheme.current.textPrimaryContrast}>
                                </Icon>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                {questionContent}
                <View style={mode === 'single' ? styles.optionsRowHalf : styles.optionsRow}>                  
                    <View style={styles.submitWrapper}>
                        <IconButton icon="chart-areaspline" text={Strings.form_calculate}onPress={calculateHandler}  ></IconButton>
                    </View>
                </View>
            </View>
        )
    }

    function resetHandler() {
        Alert.alert(Strings.form_dialog_confirm_reset_title, Strings.form_dialog_confirm_reset_content, [
            { text: Strings.form_reset, onPress: () => resetForm(), style: "destructive" },
            { text: Strings.cancel, style: "default" },
        ],
            { cancelable: false });
        return;
    }

    function resetForm() {
        //An updated form id triggers the rerender/update in each QuestionView
        setFormId(formId + 1)
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
        });

        //Check first if no input was given. 
        if (indiciesEmpty.length == questions.length) {
            Alert.alert(Strings.form_dialog_empty_title, Strings.form_dialog_empty_content, [
                { text: Strings.okay, onPress: () => console.log("Canceled sending"), style: "cancel" },
            ],
                { cancelable: false });
            return;
        }

        if (indiciesError.length > 0) {
            Alert.alert(Strings.form_dialog_errors_title, Strings.form_dialog_errors_content + ' Fehlerhaft: (' + indiciesError.join(', ') + ')', [
                { text: Strings.okay, onPress: () => console.log("Canceled sending"), style: "cancel" },
            ],
                { cancelable: false });
            return;
        }

        if (indiciesEmpty.length > 0) {
            Alert.alert(Strings.form_dialog_send_unfinished_title,   Strings.form_dialog_send_unfinished_content + ' Unbeantwortet: (' + indiciesEmpty.join(', ') + ')', [
                { text: Strings.cancel, onPress: () => console.log("Canceled sending"), style: "cancel" },
                { text: Strings.form_send, onPress: () => gotoEvaluation(questions), style: "default" }
            ],
                { cancelable: false });
        } else {
            gotoEvaluation(questions);
        }
    }

    function gotoEvaluation(questions) {
        const send = []
        questions.forEach(q => {
            if (q.input) {
                send.push({ 'questionUUID': q.uuid, 'value': q.input })
            }
        })
        const data = JSON.stringify(send);
        props.navigation.navigate("Evaluation", data)
    }
}

styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorTheme.current.background
    },
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
        backgroundColor: ColorTheme.current.primary,
        borderRadius: Layout.borderRadius,
        padding: 8,
        flex: 1
    },
    pagingButtonDisabled: {
        backgroundColor: ColorTheme.current.grey,
        borderRadius: Layout.borderRadius,
        padding: 8,
        flex: 1
    },
    pageInfo: {
        backgroundColor: ColorTheme.current.primary,
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
    },
});

export default FormScreen