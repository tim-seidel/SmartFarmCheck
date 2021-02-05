import React from 'react'
import { Text, Platform, TextInput, StyleSheet } from 'react-native'

import { useThemeProvider } from '../ThemeContext'
import Layout from '../constants/Layout'

/**
 * This file contains the default text formats for the application.
 **/

//Constants

const text_size_heading = 19
const text_size_heading_large = 22

const text_size_content = 16 // Platform.isPas ? 18 : 16
const text_size_content_small = 14
const text_size_content_large = 17

const text_weight_heading = Platform.OS === 'ios' ? '500' : '900'
const text_weight_content = "normal"

/*
const colors = {
    text : colorTheme.textPrimary,
    text_light : colorTheme.textSecondary,
    text_error : colorTheme.error
}
*/

//Components
export const HeadingText = (props) => {
    const { colorTheme } = useThemeProvider()

    return (
        <Text {...props} style={[{
            color: colorTheme.textPrimary,
            fontWeight: props.weight ?? text_weight_heading,
            fontSize: props.large ? text_size_heading_large : text_size_heading,
            textAlign: props.align ?? 'auto'
        }, props.style]}>{props.children}</Text>
    )
}

export const ContentText = (props) => {
    const { colorTheme } = useThemeProvider()

    return (
        <Text {...props} style={[{
            color: props.error ? colorTheme.error : props.light ? colorTheme.textSecondary : colorTheme.textPrimary,
            fontWeight: props.weight ?? text_weight_content,
            fontSize: props.large ? text_size_content_large : props.small ? text_size_content_small : text_size_content,
            textAlign: props.align ?? 'auto'
        }, props.style]}>{props.children}</Text>
    )
}

export const Input = (props) => {
    const { colorTheme } = useThemeProvider()

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