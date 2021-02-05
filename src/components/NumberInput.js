import React from 'react'
import { StyleSheet,  View, TextInput} from 'react-native'

import { useThemeProvider } from '../ThemeContext'
import { ContentText } from './Text'

import Layout from '../constants/Layout'
import Strings from '../constants/Strings'

/**
 * View that represents a input field for numbers.
 */
const NumberInput = (props) => {
    const { colorTheme } = useThemeProvider()
    const {input, unit, numberChanged} = props

    return (
        <View style={styles.row}>
            <TextInput
                value={input}
                placeholder={Strings.form_input_placeholder}
                placeholderTextColor={colorTheme.textHint}
                onChangeText={numberChanged} keyboardType="numeric"
                style={{
                    ...(unit ? styles.inputWithUnit : styles.input),
                    color: colorTheme.textPrimary,
                    backgroundColor: colorTheme.background
                }} />
            {unit && <View style={{ ...styles.unitTextWrapper, backgroundColor: colorTheme.background }}>
                <ContentText>in [{unit}]</ContentText>
            </View>}
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
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
        fontSize: 16,
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
        fontSize: 16
    }
})

export default NumberInput
