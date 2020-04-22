import React from 'react';
import { View, VirtualizedList, SafeAreaView, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import NoContentView from "../components/NoContentView"
import QuestionView from "../components/QuestionView"
import IconButton from '../components/IconButton';

class FormScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
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
                    console.log("Error", error)
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

    render() {
        const { error, isLoaded, questions, formId } = this.state;
        console.log("FormScreen.render()")

        if (error) {
            return <NoContentView icon="emoticon-sad-outline" onRetry={this.onRetryHandler.bind(this)} title="Aktuell kann das Formular nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut."></NoContentView>
        } else if (!isLoaded) {
            return <NoContentView icon="cloud-download" loading title="Laden des akutellsten Fragebogens..."></NoContentView>
        } else if (questions.length === 0) {
            return <NoContentView icon="emoticon-sad-outline" onRetry={this.onRetryHandler.bind(this)} title="Aktuell können die Fragen des Fragebogens nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut."></NoContentView>
        } else {
            return (
                <View style={styles.container}>
                    <VirtualizedList
                        data={questions}
                        renderItem={({ item, index }) => <QuestionView formId={formId} onInputChanged={(input, validity) => this.inputChangeHandler(item, input, validity)} index={index + 1} question={item} key={item.uuid} />}
                        keyExtractor={item => item.uuid}
                        getItemCount={() => questions.length}
                        getItem={(data, index) => { return questions[index] }}
                    />
                    <View style={styles.buttonRow}>
                        <View style={styles.wrapperLeft}>
                            <IconButton outlined icon="close" text="Zurücksetzen" onPress={() => { this.onResetHandler() }} align="center"></IconButton>
                        </View>
                        <View style={styles.wrapperRight}>
                            <IconButton icon="chart-areaspline" text="Jetzt berechnen" onPress={() => this.onCalculateHandler()} align="center" ></IconButton>
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
            { formId: (this.state.formId+1) }
        )
    }

    onCalculateHandler() {
        const questions = this.state.questions;
        const indiciesError = []

        questions.forEach((q, index) => {
            if (q.validity === 'invalid') {
                indiciesError.push(index + 1)
            }
        });

        if (indiciesError.length > 0) {
            Alert.alert('Fehlerhafte Eingaben', 'Bitte berichtigen Sie zuerst die ungültigen Eingaben, bevor Sie das Formualar absenden. Fehlerhaft: (' + indiciesError.join(', ') + ')', [
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
    buttonRow: {
        flexDirection: "row",
        marginVertical: 8
    },
    wrapperLeft: {
        marginStart: 8,
        marginEnd: 4,
        flex: 1
    },
    wrapperRight: {
        marginStart: 4,
        marginEnd: 8,
        flex: 1
    }
});

// Wrap for navigation
export default function (props) {
    const navigation = useNavigation();

    return <FormScreen {...props} navigation={navigation} />;
}