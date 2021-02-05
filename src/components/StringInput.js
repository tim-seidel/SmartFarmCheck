import React from 'react'
import { StyleSheet, TextInput } from 'react-native'

import { useThemeProvider } from '../ThemeContext'

import Layout from '../constants/Layout'
import Strings from '../constants/Strings'

/**
 * View that represents a input field for strings.
 */
const StringInput = (props) => {
    const { colorTheme } = useThemeProvider()
    const { input, textChanged } = props

    return (
        <TextInput
            value={input}
            placeholder={Strings.form_input_placeholder}
            placeholderTextColor={colorTheme.textHint}
            onChangeText={textChanged}
            style={{
                ...styles.input,
                backgroundColor: colorTheme.background
            }} />
    )
}

const styles = StyleSheet.create({
    input: {
        flex: 1,
        marginTop: 4,
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: Layout.borderRadius,
        borderWidth: 1,
        borderColor: Layout.borderColor,
        fontSize: 16,
    }
})

export default StringInput
