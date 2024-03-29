import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'

import { ContentText } from './common/Text'

import { darkTheme, lightTheme } from '../constants/Colors'
import Layout from '../constants/Layout'
import Strings from '../constants/Strings'
import { isStringEmpty } from '../models/Validation'

/**
 * View that represents a input field for numbers.
 */
const NumberInput = (props) => {
	const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme
	const { input, unit, numberChanged } = props

	const hasUnit = !isStringEmpty(unit)

	return (
		<View style={styles.row}>
			<TextInput
				value={input}
				placeholder={Strings.form_input_placeholder}
				placeholderTextColor={colorTheme.textHint}
				keyboardType="numeric"
				onChangeText={numberChanged}
				style={{
					...(unit ? styles.inputWithUnit : styles.input),
					color: colorTheme.textPrimary,
					backgroundColor: colorTheme.background
				}} />
			{hasUnit && <View style={{ ...styles.unitTextWrapper, backgroundColor: colorTheme.background }}>
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
