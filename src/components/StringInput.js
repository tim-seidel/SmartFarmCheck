import React from 'react'
import { StyleSheet, TextInput } from 'react-native'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'

import { darkTheme, lightTheme } from '../constants/Colors'
import Layout from '../constants/Layout'
import Strings from '../constants/Strings'

/**
 * View that represents a input field for strings.
 */
const StringInput = (props) => {
	const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme
	const { input, textChanged, placeholder } = props

	return (
		<TextInput
			value={input}
			placeholder={placeholder ?? Strings.form_input_placeholder}
			multiline
			numberOfLines={2}
			textAlignVertical='top'
			placeholderTextColor={colorTheme.textHint}
			onChangeText={textChanged}
			style={{
				...styles.input,
				color: colorTheme.textPrimary,
				backgroundColor: colorTheme.background
			}} />
	)
}

const styles = StyleSheet.create({
	input: {
		marginTop: 4,
		paddingHorizontal: 8,
		paddingVertical: 8,
		borderRadius: Layout.borderRadius,
		borderWidth: 1,
		borderColor: Layout.borderColor,
		fontSize: 16,
	}
})

export default StringInput
