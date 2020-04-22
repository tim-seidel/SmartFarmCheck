import React, { useReducer, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, AsyncStorage } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../constants/Colors';
import { StringValidator, NumberValidatior, SelectValidator } from "../model/Validation"
import SelectInput from "./SelectInput"

const INPUT_CHANGE = "INPUT_CHANGE"
const FORM_ID_CHANGE = "FORM_ID_CHANGE"
const inputReducer = (state, action) => {
    switch (action.type) {
        case INPUT_CHANGE:
            return {
                ...state,
                input: action.input,
                validity: action.validity,
                errorMessage: action.errorMessage
            }
        case FORM_ID_CHANGE:
            return {
                ...state,
                formId: action.formId
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
        formId: 0
    })

    if (formId !== inputState.formId) {
        dispatch({
            type: FORM_ID_CHANGE,
            formId: props.formId
        })
        setInput('');
    }

    useEffect(() => {
        getPrefillValue()
    }, []);

    async function getPrefillValue() {
        try {
            let value = await AsyncStorage.getItem(question.uuid)
            if (value) {
                setInput(value, false)
            } else {
                setDefaultMessage()
            }
        } catch (e) { }
    }

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

    function setDefaultMessage() {
        var message = ""
        switch (question.validator.inputType.toLowerCase()) {
            case "number":
                message = NumberValidatior(question.validator, '').message
                break;
            case "text":
                message = StringValidator(question.validator, '').message
                break;
            case "select":
                message = SelectValidator(question.validator, '').message
                break;
        }

        dispatch({
            type: INPUT_CHANGE,
            errorMessage: message
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
            if (s_input) {
                AsyncStorage.setItem(question.uuid, s_input)
            } else {
                AsyncStorage.removeItem(question.uuid)
            }
        }

        props.onInputChanged(s_input, validity)
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

    const questionInfoHandler = (question) => {
        Alert.alert(
            question.text,
            question.description,
            [{ text: "Okay!", style: "default" }]
        )
    }

    return (
        <View style={styles.question}>
            <View style={styles.numberWrapper}>
                <Text style={styles.questionNumber}>{props.index}</Text>
            </View>
            <View style={styles.questionInputColumn}>
                <View style={styles.questionRow}>
                    <Text style={styles.questionTitle}>{question.text}</Text>
                    {question.description && (<Icon style={styles.infoIcon} onPress={questionInfoHandler.bind(this, question)} name="information-outline" size={24}></Icon>)}
                </View>
                <View style={styles.errorRow}>
                    <Icon style={styles.errorIcon} name={validityToIcon(inputState.validity)} size={24}></Icon>
                    <Text style={(inputState.validity === 'invalid') ? styles.errorMessage : styles.hintMessage}>{inputState.errorMessage}</Text>
                </View>
                {inputView}

            </View>
        </View>
    )
}

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
        flex: 1,
        flexDirection: "row",
        backgroundColor: '#fff',
        paddingHorizontal: 8,
        paddingVertical: 16,
        borderColor: "black",
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
    questionTitle: {
        fontSize: 20,
        flex: 1
    },
    infoIcon: {
        marginTop: 4,
    },
    errorRow: {
        marginTop: 4,
        flexDirection: "row"
    },
    errorIcon: {
        alignSelf: "center",
        marginEnd: 4
    },
    hintMessage: {
        fontSize: 16,
    },
    errorMessage: {
        fontSize: 16,
        color: "red",
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