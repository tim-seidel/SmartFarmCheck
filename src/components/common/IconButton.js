import React from 'react'
import { StyleSheet, Platform } from 'react-native'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import PropTypes from 'prop-types'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'

import { ContentText } from './Text'
import { ConstantColors, darkTheme, lightTheme } from '../../constants/Colors'
import Layout from '../../constants/Layout'

/**
 * @summary Basic UI button element that represents a button unified across the app. 
 * @description There are a few customization options:
 * - type:
 *   - outline
 *   - solid (filled)  <- default (on iOS transparent)
 *   - light: transparent
 * - icon: the mdi icon code
 * - text
 * - onPress: callback
 * Has darkmode support.
 * @param {Object} props The standard react native ui props.
 */
const IconButton = (props) => {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme
    const { icon, text, type, disabled, success, error } = props

    let backgroundColor = ConstantColors.transparent
    if (type === 'solid') {
        backgroundColor = colorTheme.primary
        if (success) backgroundColor = colorTheme.success
        if (error) backgroundColor = colorTheme.error
        if (disabled) backgroundColor = ConstantColors.grey
    }

    return (
        <Icon.Button
            style={[type === 'outline' ? { ...styles.buttonOutlined, borderColor: colorTheme.primary } : styles.button, props.style]}
            name={icon}
            size={24}
            disabled={disabled ?? false}
            color={type === 'solid' ? colorTheme.textPrimaryContrast : colorTheme.primary}
            backgroundColor={backgroundColor}
            underlayColor={Platform.OS == 'ios' ? colorTheme.componentBackground : colorTheme.accent}
            onPress={props.onPress}>
            <ContentText
                numberOfLines={1}
                lineBreakMode="tail"
                ellipsizeMode="tail"
                style={{ color: type === 'solid' ? colorTheme.textPrimaryContrast : colorTheme.primary }}>
                {text}
            </ContentText>
        </Icon.Button>
    )
}

IconButton.propTypes = {
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['solid', 'light', 'outline']),
    disabled: PropTypes.bool,
    success: PropTypes.bool,
    error: PropTypes.bool
}

IconButton.defaultProps = {
    type: Platform.select({
        ios: "light",
        android: "solid",
        default: "solid"
    }),
    disabled: false,
    success: false,
    error: false
}

const styles = StyleSheet.create({
    button: {
        justifyContent: "center",
        borderRadius: Layout.borderRadius,
    },
    buttonOutlined: {
        borderWidth: 1.5,
        justifyContent: "center",
        borderRadius: Layout.borderRadius,
    }
})

export default IconButton
