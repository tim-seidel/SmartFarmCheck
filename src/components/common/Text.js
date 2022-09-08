/**
 * This file defines the default text objects to be used all across the app.
 */

import React from 'react'
import { Text, Platform, TextInput } from 'react-native'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import PropTypes from 'prop-types'

import Layout from '../../constants/Layout'
import { ConstantColors, darkTheme, lightTheme } from '../../constants/Colors'

const text_size_heading = 19
const text_size_heading_large = 22

const text_size_content = 16 // Platform.isPad ? 18 : 16
const text_size_content_small = 14
const text_size_content_large = 17

const text_weight_heading = "500"
const text_weight_content = "normal"

/**
 * @summary A wrapper for heading text that gets used all across the app. It standadises the text used in the app. It also handles the darkmode.
 * @description Can be customized by the following props:
 * - large
 * - weight
 * - align
 * - disabled
 * @param {Object} props The standard react native ui props 
 */
export const HeadingText = (props) => {
	const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

	return (
		<Text
			{...props}
			textBreakStrategy='simple'
			android_hyphenationFrequency="full"
			style={[{
				flexShrink: 1,
				color: props.disabled ? ConstantColors.grey : colorTheme.textPrimary,
				fontWeight: props.weight,
				fontSize: props.large ? text_size_heading_large : text_size_heading,
				textAlign: props.align
			}, props.style]}>{props.children}</Text>
	)
}

HeadingText.propTypes = {
	weight: PropTypes.oneOf(["100", "200", "300", "400", "500", "600", "700", "800", "900", "bold", "normal"]),
	align: PropTypes.oneOf(["auto", "center", "justify", "left", "right"]),
	large: PropTypes.bool,
	disabled: PropTypes.bool
}
HeadingText.defaultProps = {
	weight: text_weight_heading,
	align: "auto",
	large: false,
	disabled: false
}

/**
 * @summary A wrapper for content text that gets used all across the app. It standadises the text used in the app. It also handles the darkmode.
 * @description Can be customized by the following props:
 * - large
 * - small
 * - weight
 * - align
 * - error 
 * @param {Object} props The standard react native ui props 
 */
export const ContentText = (props) => {
	const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

	return (
		<Text {...props}
			textBreakStrategy='simple'
			android_hyphenationFrequency="full"
			style={[{
				flexShrink: 1,
				color: props.error ? colorTheme.error : props.light ? colorTheme.textSecondary : colorTheme.textPrimary,
				fontWeight: props.weight,
				fontSize: props.large ? text_size_content_large : props.small ? text_size_content_small : text_size_content,
				textAlign: props.align
			}, props.style]}>{props.children}</Text>
	)
}

// Small/large, error/light as bools for now. Maybe PropTypes.oneOf(["small, large, ..."]) later
ContentText.propTypes = {
	weight: PropTypes.oneOf(["100", "200", "300", "400", "500", "600", "700", "800", "900", "bold", "normal"]),
	align: PropTypes.oneOf(["auto", "center", "justify", "left", "right"]),
	large: PropTypes.bool,
	small: PropTypes.bool,
	error: PropTypes.bool,
	light: PropTypes.bool
}
ContentText.defaultProps = {
	weight: text_weight_content,
	align: "auto",
	large: false,
	small: false,
	error: false,

}

/**
 * @summary A wrapper for text input that gets used all across the app. It standadises the text used in the app. It also handles the darkmode.
 * @description Can be customized by the following props:
 * - placeholder
 * - onTextChange
 * @param {Object} props The standard react native ui props 
 */
export const Input = (props) => {
	const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

	return (
		<TextInput
			value={props.value}
			onChangeText={props.onChangeText}
			placeholder={props.placeholder}
			placeholderTextColor={colorTheme.textHint}
			textAlignVertical="top"
			{...props}
			style={{
				backgroundColor: colorTheme.componentBackground,
				color: colorTheme.textPrimary,
				fontSize: text_size_content,
				borderColor: Layout.borderColor,
				borderRadius: Layout.borderRadius,
				borderWidth: Layout.borderWidth,
				padding: 8,
				...props.style
			}} />
	)
}