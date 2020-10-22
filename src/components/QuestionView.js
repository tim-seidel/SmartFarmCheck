import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Alert, AsyncStorage } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { StringValidation, NumberValidation, SelectValidation } from "../models/Validation"
import SelectInput from "./SelectInput"
import { HeadingText, ContentText } from './Text'
import Layout from '../constants/Layout'
import { useThemeProvider } from '../ThemeContext'
import { ConstantColors } from '../constants/Colors'
import Strings from '../constants/Strings'
import Keys from '../constants/Keys'

const QuestionView = props => {
    const { colorTheme } = useThemeProvider()
    const { questionId, validator } = props

    const [input, setInput] = useState(props.prefill ?? '')
    const [validity, setValidity] = useState('unedited')
    const [errorMessage, setErrorMessage] = useState('Bitte einen Wert eingeben')
    const validation = validator.inputType === "NUMBER" ? NumberValidation : validator.inputType === "SELECT" ? SelectValidation : StringValidation

    useEffect(() => {
        const { validity, message } = validation(validator, input)
        setValidity(validity)
        setErrorMessage(message)
    }, [input])

    //TODO: Clear form (atm via form)

    //The base function for input handling that calculates the validation
    //and updates the state (input, message, validity).
    //It also stores or removes the input for prefill usage if needed
    async function inputHandler(s_input) {
        s_input = s_input.trim()
        if (s_input === input) return

        setInput(s_input)

        if (s_input != null && input.trim() != '') {
            await AsyncStorage.setItem(Keys.PREFILL_PREFIX + questionId, s_input)
        } else {
            await AsyncStorage.removeItem(Keys.PREFILL_PREFIX + questionId)
        }

        props.onInputChanged(s_input, validity)
    }

    const questionInfoHandler = () => {
        Alert.alert(
            props.text,
            props.description,
            [{ text: Strings.okay, style: "default" }]
        )
    }

    let inputView
    switch (validator.inputType.toLowerCase()) {
        case "number":
            inputView = <NumberInput input={input} unit={validator.unit} numberChanged={inputHandler} />
            break
        case "text":
            inputView = <StringInput input={input} textChanged={inputHandler} />
            break
        case "select":
            inputView = <SelectInput options={validator.options} input={input} selectionChanged={inputHandler} />
            break
    }

    return (
        <View style={{ ...styles.question, backgroundColor: colorTheme.componentBackground }}>
            <View style={{ ...styles.numberWrapper, borderColor: colorTheme.textPrimary, backgroundColor: colorTheme.background }}>
                <Text style={{ ...styles.questionNumber, color: colorTheme.textPrimary }}>{props.index}</Text>
            </View>
            <View style={styles.questionInputColumn}>
                <View style={styles.questionRow}>
                    <HeadingText weight="normal" style={{ flex: 1 }}>{props.text}</HeadingText>
                    {props.description && (<Icon style={{ ...styles.infoIcon, color: colorTheme.textPrimary }} onPress={questionInfoHandler} name="information-outline" size={24}></Icon>)}
                </View>
                <View style={styles.errorRow}>
                    <Icon name={validityToIcon(validity)} size={24} color={colorTheme.textPrimary}></Icon>
                    <View style={styles.errorTextWrapper}>
                        <ContentText small error={validity === 'invalid'} light={validity === 'valid'}>{errorMessage}</ContentText>
                    </View>
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
    const { colorTheme } = useThemeProvider()

    return (
        <View style={styles.numberRow}>
            <TextInput
                value={props.input}
                placeholder={Strings.form_input_placeholder}
                placeholderTextColor={ConstantColors.lightgrey}
                onChangeText={props.numberChanged} keyboardType="numeric"
                style={{
                    ...(props.unit ? styles.inputWithUnit : styles.input),
                    color: colorTheme.textPrimary,
                    backgroundColor: colorTheme.background
                }}/>
            {props.unit && <View style={{ ...styles.unitTextWrapper, backgroundColor: colorTheme.background }}>
                <ContentText>in [{props.unit}]</ContentText>
            </View>}
        </View>
    )
}

const StringInput = (props) => {
    const { colorTheme } = useThemeProvider()

    return (
        <TextInput
            value={props.input}
            placeholder={Strings.form_input_placeholder}
            placeholderTextColor={ConstantColors.lightgrey}
            onChangeText={props.textChanged}
            style={{
                ...styles.input,
                backgroundColor: colorTheme.background
            }}/>
    )
}

const styles = StyleSheet.create({
    question: {
        flexDirection: "row",
        marginHorizontal: 8,
        marginVertical: 8,
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
    numberRow: {
        flexDirection: 'row'
    },
    unitTextWrapper: {
        marginTop: 4,
        paddingHorizontal: 4,
        borderRadius: Layout.borderRadius,
        borderWidth: 1,
        borderColor: Layout.borderColor,
        borderLeftWidth: 0,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        marginTop: 4,
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: Layout.borderRadius,
        borderWidth: 1,
        borderColor: Layout.borderColor,
        fontSize: 17,
    },
    inputWithUnit: {
        flex: 1,
        marginTop: 4,
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderTopLeftRadius: Layout.borderRadius,
        borderBottomLeftRadius: Layout.borderRadius,
        borderColor: Layout.borderColor,
        borderEndWidth: 0,
        borderTopEndRadius: 0,
        borderBottomRightRadius: 0,
        fontSize: 17
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
