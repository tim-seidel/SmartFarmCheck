import React, { useState, useEffect } from 'react';
import { View, VirtualizedList, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import NoContentView from "../components/NoContentView";
import QuestionView from "../components/QuestionView";
import IconButton from '../components/IconButton';
import Colors from '../constants/Colors';

const SFCHeaderButton = props => (
    <HeaderButton {...props} IconComponent={Icon} iconSize={24} color={Colors.white} />
)

const FormScreen = props => {
    const [mode, setMode] = useState('list')
    const [questionState, setQuestionState] = useState({ isLoaded: false, error: null, questions: [] })
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
                    setQuestionState({ isLoaded: true, error: null, questions: json })
                })
                .catch(error => {
                    console.log("error", error)
                    setQuestionState(qs => ({ isLoaded: false, error: error, questions: qs.questions }))
                })
        }
    }

    function retryHandler() {
        setLoadingState({ isLoaded: false, error: null })
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
    props.navigation.setOptions({
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={SFCHeaderButton}>
                <Item iconName="format-list-checkbox" title="Layout" onPress={layoutChangeHandler} />
            </HeaderButtons>
        )
    })

    const { isLoaded, error, questions } = questionState;
    console.log("FormScreen.render()", isLoaded, error, questions.length)
    if (error) {
        return <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title="Aktuell kann das Formular nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut."></NoContentView>
    } else if (!isLoaded) {
        return <NoContentView icon="cloud-download" loading title="Laden des akutellsten Fragebogens..."></NoContentView>
    } else if (questions.length === 0) {
        return <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title="Aktuell können die Fragen des Fragebogens nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut."></NoContentView>
    } else {
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
                                    color={Colors.white}>
                                </Icon>
                                <Text
                                    numberOfLines={1}
                                    lineBreakMode="tail"
                                    ellipsizeMode="tail"
                                    style={{ fontSize: 16, color: Colors.white }}>
                                    Zurück
                                    </Text>
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.pageInfo}>{pagingIndex + 1}/{questions.length}</Text>
                        <TouchableOpacity disabled={!canNavigateNext} activeOpacity={0.7} onPress={() => { questionPagingHandler(true) }} style={canNavigateNext ? styles.pagingButton : styles.pagingButtonDisabled}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                                <Text
                                    numberOfLines={1}
                                    lineBreakMode="tail"
                                    ellipsizeMode="tail"
                                    style={{ fontSize: 16, color: Colors.white }}>
                                    Weiter
                                    </Text>
                                <Icon
                                    name="chevron-right"
                                    size={24}
                                    color={Colors.white}>
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
                    <View style={styles.wrapperLeft}>
                        <IconButton outlined icon="close" text="Zurücksetzen" onPress={resetHandler} ></IconButton>
                    </View>
                    <View style={styles.wrapperRight}>
                        <IconButton icon="chart-areaspline" text="Jetzt berechnen" onPress={calculateHandler}  ></IconButton>
                    </View>
                </View>
            </View>
        )
    }

    function resetHandler() {
        Alert.alert('Wirklich zurücksetzten?', 'Wenn Sie das Formular zurücksetzten werden Ihre bisherigen Eingaben gelöscht. Möchten Sie dies?', [
            { text: "Zurücksetzen", onPress: () => resetForm(), style: "destructive" },
            { text: "Abbrechen", style: "default" },
        ],
            { cancelable: false });
        return;
    }

    function resetForm() {
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
            Alert.alert('Leere Eingaben', 'Bei einem gänzlich unausgefülltem Formular können wir Ihnen leider keine Empfehlungen berechnen. Füllen Sie dazu zunächst einige Fragen aus.\n\nFalls Sie sich nur allgemein informieren möchten, können Sie sich auf dem vorherigen Reiter über die Maßnahmen informieren.', [
                { text: "Okay", onPress: () => console.log("Canceled sending"), style: "cancel" },
            ],
                { cancelable: false });
            return;
        }

        if (indiciesError.length > 0) {
            Alert.alert('Fehlerhafte Eingaben', 'Bitte berichtigen Sie zuerst die ungültigen Eingaben, bevor Sie das Formualar absenden. Fehlerhaft: (' + indiciesError.join(', ') + ')', [
                { text: "Okay", onPress: () => console.log("Canceled sending"), style: "cancel" },
            ],
                { cancelable: false });
            return;
        }

        if (indiciesEmpty.length > 0) {
            Alert.alert('Formular absenden?', 'Sie haben noch nicht alle Fragen beantwortet (' + indiciesEmpty.join(', ') + '). Möchten Sie das Formular dennoch absenden?', [
                { text: "Abbrechen", onPress: () => console.log("Canceled sending"), style: "cancel" },
                { text: "Absenden", onPress: () => gotoEvaluation(questions), style: "default" }
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
        backgroundColor: '#fff',
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
        backgroundColor: Colors.primary,
        borderRadius: 6,
        padding: 8,
        flex: 1
    },
    pagingButtonDisabled: {
        backgroundColor: Colors.greyInactive,
        borderRadius: 6,
        padding: 8,
        flex: 1
    },
    pageInfo: {
        backgroundColor: Colors.primary,
        color: Colors.white,
        fontSize: 16,
        borderRadius: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginHorizontal: 4
    },
    optionsRow: {
        flexDirection: "row",
        padding: 4,
        margin: 8,
        borderRadius: 6
    },
    optionsRowHalf: {
        flexDirection: "row",
        padding: 4,
        marginHorizontal: 8,
        marginBottom: 8,
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6
    },
    wrapperLeft: {
        marginEnd: 2,
        flex: 1
    },
    wrapperRight: {
        marginStart: 2,
        flex: 1
    }
});

// Wrap for navigation
export default FormScreen