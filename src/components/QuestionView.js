import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { HeadingText, ContentText } from './common/Text'
import NumberInput from './NumberInput'
import SelectInput from "./SelectInput"
import StringInput from './StringInput'

import { getValidation } from "../models/Validation"
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import { darkTheme, lightTheme } from '../constants/Colors'

import Keys from '../constants/Keys'
import Layout from '../constants/Layout'
import Strings from '../constants/Strings'

/**
 * Converts the vailidy state into the corresponding icon name/code.
 */
const validityToIcon = (validity) => {
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

/**
 * Stores or deletes the persisted autofill input accordingly.
 */
const persistInputAsync = async (questionId, s_input) => {
    if (s_input != null && s_input.trim() !== '') {
        await AsyncStorage.setItem(Keys.PREFILL_PREFIX + questionId, s_input)
    } else {
        await AsyncStorage.removeItem(Keys.PREFILL_PREFIX + questionId)
    }
}

/** 
 * UI component for all form questions. Handles all the different input types like Number, Select, String
*/
const QuestionView = props => {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme
    const { questionId, validator, prefill } = props

    const [input, setInput] = useState(props.prefill ?? '')
    const [validity, setValidity] = useState('unedited')
    const [errorMessage, setErrorMessage] = useState('Bitte einen Wert eingeben')
    const validation = getValidation(validator)

    useEffect(() => {
        const { validity, message } = validation(validator, input)

        setValidity(validity)
        setErrorMessage(message)
    }, [input])

    useEffect(() => {
        setInput(prefill)
    }, [questionId])

    /**
     * Base function for input changes. It handles
     * - quick validation
     * - persisitence
     * - update to parent component.
     */
    const inputHandler = (s_input) => {
        if (s_input === input) return
        setInput(s_input)

        const { validity } = validation(validator, s_input)
        persistInputAsync(questionId, s_input)

        props.onInputChanged(s_input, validity)
    }

    /**
     * Method that handles the click on a question info and shows the dialog.
     */
    const questionInfoHandler = () => {
        Alert.alert(
            props.text,
            props.description,
            [{ text: Strings.okay, style: "default" }]
        )
    }

    //Create the input view based on the required type.
    let inputView = null
    switch (validator.inputType.toLowerCase()) {
        case "number":
            inputView = <NumberInput input={input} unit={validator.unit} numberChanged={inputHandler} />
            break
        case "text":
            inputView = <StringInput input={input} textChanged={inputHandler} />
            break
        case "select":
            inputView = <SelectInput input={input} options={validator.options} selectionChanged={inputHandler} />
            break
    }

    //Construct the layout that wraps the input with container, number, status message and icon.
    return (
        <View style={{ ...styles.question, backgroundColor: colorTheme.componentBackground, ...props.style }}>
            <View style={{ ...styles.numberWrapper, borderColor: colorTheme.textPrimary, backgroundColor: colorTheme.background }}>
                <Text style={{ ...styles.questionNumber, color: colorTheme.textPrimary }}>{props.index}</Text>
            </View>
            <View style={styles.questionInputColumn}>
                <View style={styles.questionRow}>
                    <HeadingText weight="normal" style={styles.heading}>{props.text}</HeadingText>
                    {props.description && (
                        <Icon
                            style={{ ...styles.infoIcon, color: colorTheme.textPrimary }}
                            onPress={questionInfoHandler}
                            name="information-outline"
                            size={24}
                        />)}
                </View>
                <View style={styles.errorRow}>
                    <Icon name={validityToIcon(validity)} size={24} color={colorTheme.textPrimary} />
                    <View style={styles.errorTextWrapper}>
                        <ContentText small error={validity === 'invalid'} light={validity === 'valid'}>{errorMessage}</ContentText>
                    </View>
                </View>
                {inputView}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    question: {
        flexDirection: "row",
        padding: 8,
        borderColor: Layout.borderColor,
        borderWidth: 1,
        borderRadius: Layout.borderRadius,
    },
    questionNumber: {
        fontSize: 22,
        textAlign: "center",
        textAlignVertical: "center",
        aspectRatio: 1
    },
    numberWrapper: {
        borderWidth: Layout.borderWidth,
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
    heading: {
        flex: 1
    },
    infoIcon: {
        marginTop: 4
    },
    errorRow: {
        marginVertical: 4,
        flexDirection: "row",
        alignItems: 'center'
    },
    errorTextWrapper: {
        flex: 1,
        marginStart: 8
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
    }
})

export default QuestionView
