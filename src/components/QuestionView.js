import React, { useReducer } from 'react';
import { StyleSheet, Text, View, Alert, AsyncStorage } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../constants/Colors';
import { StringValidator, NumberValidatior, SelectValidator } from "../model/Validation"
import SelectInput from "./SelectInput"
import { HeadingText, ContentText } from './Text';

const INPUT_CHANGE = "INPUT_CHANGE"
const FORM_ID_CHANGE = "FORM_ID_CHANGE"
const QUESTION_CHANGE = "QUESTION_CHANGE"
const inputReducer = (state, action) => {
    switch (action.type) {
        case INPUT_CHANGE:
            return {
                ...state,
                input: action.input,
                validity: action.validity,
                errorMessage: action.errorMessage
            }
        //The formId prop is used to clear the input from outside
        case FORM_ID_CHANGE:
            return {
                ...state,
                formId: action.formId
            }
        case QUESTION_CHANGE:
            return {
                ...state,
                questionId: action.questionId
            }
        default:
            return state;
    }
}

const QuestionView = props => {
    const { question, formId } = props;

    const [inputState, dispatch] = useReducer(inputReducer, {
        input: props.initalValue ?? '',
        validity: 'unedited',
        errorMessage: 'Bitte einen Wert eingeben',
        formId: 0,
        questionId: ''
    })

    if (formId !== inputState.formId) {
        dispatch({
            type: FORM_ID_CHANGE,
            formId: props.formId
        })
        setInput('');
    }

    if (inputState.questionId !== question.uuid) {
        dispatch({
            type: QUESTION_CHANGE,
            questionId: question.uuid
        })
        setupWithPrefillValueOrDefault();
    }

    async function setupWithPrefillValueOrDefault() {
        try {
            let value = await AsyncStorage.getItem(question.uuid)
            if (value) {
                setInput(value, false)
            } else {
                setDefaultMessage()
            }
        } catch (e) { }
    }

    //Sets the given input and updates the message
    //If store is set, the value will be stored for prefill usage.
    function setInput(value, store = true) {
        switch (question.validator.inputType.toLowerCase()) {
            case "number":
                NumberInputHandler(question.validator, value ?? undefined, store)
                break;
            case "text":
                TextInputHandler(question.validator, value ?? '', store)
                break;
            case "select":
                SelectInputHandler(question.validator, value ?? '', store)
                break;
        }
    }

    //Sets the input to an empty state and triggers the default emmpty/error message
    function setDefaultMessage() {
        var message = ''
        const _input = ''
        switch (question.validator.inputType.toLowerCase()) {
            case "number":
                message = NumberValidatior(question.validator, _input).message
                break;
            case "text":
                message = StringValidator(question.validator, _input).message
                break;
            case "select":
                message = SelectValidator(question.validator, _input).message
                break;
        }

        dispatch({
            type: INPUT_CHANGE,
            errorMessage: message,
            input: _input
        })
    }

    function NumberInputHandler(validaton, s_input, store = true) {
        InputHandler(NumberValidatior, validaton, s_input, store)
    }

    function TextInputHandler(validaton, s_input, store = true) {
        InputHandler(StringValidator, validaton, s_input)
    }

    function SelectInputHandler(validation, s_input, store = true) {
        InputHandler(SelectValidator, validation, s_input, store)
    }

    //The base function for input handlingm that calculates the validation
    //and updates the state (input, message, validity).
    //It also stores or removes the input for prefill usage if needed
    function InputHandler(validator, validation, s_input, store) {
        s_input = s_input.trim();
        if (s_input === inputState.input) return;

        const { validity, message } = validator(validation, s_input)
        dispatch({
            type: INPUT_CHANGE,
            input: s_input,
            validity: validity,
            errorMessage: message
        })

        if (store) {
            if (s_input) { //TODO better check or length. (E.g if s_input is 'false' (string) It might be treated as not store-worthy)
                AsyncStorage.setItem(question.uuid, s_input)
            } else {
                AsyncStorage.removeItem(question.uuid)
            }
        }

        props.onInputChanged(s_input, validity)
    }

    const QuestionInfoHandler = (question) => {
        Alert.alert(
            question.text,
            question.description,
            [{ text: "Okay!", style: "default" }]
        )
    }

    let inputView;
    switch (question.validator.inputType.toLowerCase()) {
        case "number":
            inputView = <NumberInput input={inputState.input} numberChanged={(number) => { NumberInputHandler(question.validator, number) }} />
            break;
        case "text":
            inputView = <StringInput input={inputState.input} textChanged={(text) => TextInputHandler(question.validator, text)} />
            break;
        case "select":
            inputView = <SelectInput options={question.validator.options} input={inputState.input} selectionChanged={(value) => SelectInputHandler(question.validator, value)} />
            break;
    }

    return (
        <View style={styles.question}>
            <View style={styles.numberWrapper}>
                <Text style={styles.questionNumber}>{props.index}</Text>
            </View>
            <View style={styles.questionInputColumn}>
                <View style={styles.questionRow}>
                    <HeadingText weight="normal" style={{flex: 1}}>{question.text}</HeadingText>
                    {question.description && (<Icon style={styles.infoIcon} onPress={QuestionInfoHandler.bind(this, question)} name="information-outline" size={24}></Icon>)}
                </View>
                <View style={styles.errorRow}>
                    <Icon style={styles.errorIcon} name={validityToIcon(inputState.validity)} size={24}></Icon>
                    <ContentText small error={inputState.validity === 'invalid'} light={inputState.validity === 'valid'} style={{flex: 1}} >{inputState.errorMessage}</ContentText>
                </View>
                {inputView}

            </View>
        </View>
    )
}

//Converts the validity state (string) to the corresponding icon code.
function validityToIcon(validity) {
    switch (validity) {
        case 'valid':
            return "check"
        case 'invalid':
            return "alert-outline"
        case 'unedited':
        default:
            return "chevron-double-right"
    }
}

const NumberInput = (props) => {
    return (
        <TextInput value={props.input} onChangeText={props.numberChanged} keyboardType="numeric" style={styles.input} placeholder="Hier eingeben..."></TextInput>
    )
}

const StringInput = (props) => {
    return (
        <TextInput style={styles.input} placeholder="Hier eingeben..."></TextInput>
    )
}

const styles = StyleSheet.create({
    question: {
        flexDirection: "row",
        backgroundColor: '#fff',
        marginHorizontal: 8,
        marginTop: 16,
        marginBottom: 32,
        borderColor: "black"
    },
    questionNumber: {
        fontSize: 22,
        textAlign: "center",
        textAlignVertical: "center",
        aspectRatio: 1
    },
    numberWrapper: {
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 24,
        padding: 2,
        alignSelf: "baseline",
        marginEnd: 8
    },
    questionInputColumn: {
        flex: 1,
    },
    questionRow: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    infoIcon: {
        marginTop: 4,
    },
    errorRow: {
        marginVertical: 4,
        flexDirection: "row"
    },
    errorIcon: {
        alignSelf: "center",
        marginEnd: 4
    },
    input: {
        marginTop: 4,
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 17,
        borderColor: Colors.greyInactive
    },
    buttonRow: {
        flexDirection: "row",
        marginBottom: 4
    },
    wrapperLeft: {
        flex: 1,
        marginStart: 4,
        marginEnd: 2
    },
    wrapperRight: {
        flex: 1,
        marginStart: 2,
        marginEnd: 4
    },
    eventButton: {
        backgroundColor: Colors.primary,
        justifyContent: "center"
    }
});

export default QuestionView;