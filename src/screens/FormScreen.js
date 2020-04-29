import React from 'react';
import { View, VirtualizedList, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import NoContentView from "../components/NoContentView";
import QuestionView from "../components/QuestionView";
import IconButton from '../components/IconButton';
import Colors from '../constants/Colors';

const SFCHeaderButton = props => (
    <HeaderButton {...props} IconComponent={Icon} iconSize={24} color={Colors.white} />
)

class FormScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            mode: 'list',
            questionIndex: 0,
            questions: [],
            formId: 0
        }
    }

    componentDidMount() {
        this.loadQuestions();
    }

    loadQuestions() {
        if (!this.state.isLoaded) {
            fetch('https://pas.coala.digital/v1/questions', {
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
            })
                .then(response => response.json())
                .then(json => {
                    this.setState({
                        isLoaded: true,
                        questions: json,
                        error: null,
                        formId: 0
                    })
                })
                .catch(error => {
                    console.log("error", error)
                    this.setState({
                        isLoaded: false,
                        error: error
                    })
                })
        }
    }

    onRetryHandler() {
        this.setState({
            isLoaded: false,
            error: null
        }, this.loadQuestions.bind(this));
    }

    inputChangeHandler(question, input, validity) {
        question.input = input
        question.validity = validity
    }

    layoutChangeHandler() {
        this.setState(prevState => ({
            mode: prevState.mode === 'list' ? 'single' : 'list'
        }))
    }

    questionPagingHandler(toNext) {
        const qi = this.state.questionIndex;
        var qNext = toNext ? qi + 1 : qi - 1;
        if (qNext < 0) {
            qNext = 0
        }
        if (qNext > (this.state.questions.length - 1)) {
            qNext = this.state.questions.length - 1
        }
        this.setState({
            questionIndex: qNext
        })
    }

    render() {
        const { error, isLoaded, questions, formId, mode, questionIndex } = this.state;
        console.log("FormScreen.render()")

        this.props.navigation.setOptions({
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={SFCHeaderButton}>
                    <Item iconName="format-list-checkbox" title="Layout" onPress={() => this.layoutChangeHandler()} />
                </HeaderButtons>
            )
        })

        if (error) {
            return <NoContentView icon="emoticon-sad-outline" onRetry={this.onRetryHandler.bind(this)} title="Aktuell kann das Formular nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut."></NoContentView>
        } else if (!isLoaded) {
            return <NoContentView icon="cloud-download" loading title="Laden des akutellsten Fragebogens..."></NoContentView>
        } else if (questions.length === 0) {
            return <NoContentView icon="emoticon-sad-outline" onRetry={this.onRetryHandler.bind(this)} title="Aktuell können die Fragen des Fragebogens nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut."></NoContentView>
        } else {
            var questionContent = null;
            if (mode === 'list') {
                questionContent = (
                    <View style={styles.listContainer}>
                        <VirtualizedList
                            contentContainerStyle={styles.listContent}
                            data={questions}
                            renderItem={({ item, index }) => <QuestionView formId={formId} onInputChanged={(input, validity) => this.inputChangeHandler(item, input, validity)} index={index + 1} question={item} key={item.uuid} />}
                            keyExtractor={item => item.uuid}
                            getItemCount={() => questions.length}
                            getItem={(data, index) => { return questions[index] }}
                        />
                    </View>)
            } else if (mode === 'single') {
                const currentQuestion = questions[questionIndex]
                const canNavigatePrevious = questionIndex > 0
                const canNavigateNext = (questionIndex < (questions.length - 1))

                questionContent = (
                    <View style={styles.singleQuestionLayoutContainer}>
                        <QuestionView formId={formId} onInputChanged={(input, validity) => this.inputChangeHandler(currentQuestion, input, validity)} index={questionIndex + 1} question={currentQuestion} />
                        <View style={styles.questionPagingRow}>
                            <TouchableOpacity activeOpacity={0.7} disabled={!canNavigatePrevious} onPress={() => { this.questionPagingHandler(false) }} style={canNavigatePrevious ? styles.pagingButton : styles.pagingButtonDisabled}>
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
                            <Text style={styles.pageInfo}>{questionIndex + 1}/{questions.length}</Text>
                            <TouchableOpacity disabled={!canNavigateNext} activeOpacity={0.7} onPress={() => { this.questionPagingHandler(true) }} style={canNavigateNext ? styles.pagingButton : styles.pagingButtonDisabled}>
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
                            <IconButton outlined icon="close" text="Zurücksetzen" onPress={() => { this.onResetHandler() }} ></IconButton>
                        </View>
                        <View style={styles.wrapperRight}>
                            <IconButton icon="chart-areaspline" text="Jetzt berechnen" onPress={() => this.onCalculateHandler()}  ></IconButton>
                        </View>
                    </View>
                </View>
            )
        }
    }

    onResetHandler() {
        Alert.alert('Wirklich zurücksetzten?', 'Wenn Sie das Formular zurücksetzten werden Ihre bisherigen Eingaben gelöscht. Möchten Sie dies?', [
            { text: "Zurücksetzen", onPress: () => this.resetForm(), style: "destructive" },
            { text: "Abbrechen", style: "default" },
        ],
            { cancelable: false });
        return;
    }

    resetForm() {
        console.log("FormID", this.state.formId)
        this.setState(
            { formId: (this.state.formId + 1) }
        )
    }

    onCalculateHandler() {
        const questions = this.state.questions;
        const indicieserror = []

        questions.forEach((q, index) => {
            if (q.validity === 'invalid') {
                indicieserror.push(index + 1)
            }
        });

        if (indicieserror.length > 0) {
            Alert.alert('Fehlerhafte Eingaben', 'Bitte berichtigen Sie zuerst die ungültigen Eingaben, bevor Sie das Formualar absenden. Fehlerhaft: (' + indicieserror.join(', ') + ')', [
                { text: "Okay", onPress: () => console.log("Canceled sending"), style: "cancel" },
            ],
                { cancelable: false });
            return;
        } else {

            const indiciesEmpty = []
            questions.forEach((q, index) => {
                if (!q.input) {
                    indiciesEmpty.push(index + 1)
                }
            });
            if (indiciesEmpty.length > 0) {
                Alert.alert('Formular absenden?', 'Sie haben noch nicht alle Fragen beantwortet (' + indiciesEmpty.join(', ') + '). Möchten Sie das Formular dennoch absenden?', [
                    { text: "Abbrechen", onPress: () => console.log("Canceled sending"), style: "cancel" },
                    { text: "Absenden", onPress: () => this.gotoEvaluation(questions), style: "default" }
                ],
                    { cancelable: false });
            } else {
                this.gotoEvaluation(questions);
            }
        }
    }

    gotoEvaluation(questions) {
        const send = []
        questions.forEach(q => {
            if (q.input) {
                send.push({ 'questionUUID': q.uuid, 'value': q.input })
            }
        })
        const data = JSON.stringify(send);
        this.props.navigation.navigate("Evaluation", data)

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
export default function (props) {
    const navigation = useNavigation();

    return <FormScreen {...props} navigation={navigation} />;
}