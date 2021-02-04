import React from 'react'
import { StyleSheet, Platform } from 'react-native'
import PropTypes from 'prop-types'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'

import { ContentText } from './Text'
import { useThemeProvider } from '../ThemeContext'
import { ConstantColors } from '../constants/Colors'
import Layout from '../constants/Layout'

/**
 * A default button layout, that can be customized. 
 * Default styles:
 * - outline
 * - solid (filled)  <- default (on iOS transparent)
 * - light: transparent
 */
const IconButton = (props) => {
    const { colorTheme } = useThemeProvider()

    const { icon, text, type } = props
    return (
        <Icon.Button
            style={type === 'outline' ? { ...styles.buttonOutlined, borderColor: colorTheme.primary } : styles.button}
            name={icon}
            size={24}
            color={type === 'solid' ? colorTheme.textPrimaryContrast : colorTheme.primary}
            backgroundColor={type === 'solid' ? colorTheme.primary : ConstantColors.transparent}
            underlayColor={colorTheme.accent}
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
    type: PropTypes.oneOf(['solid', 'light', 'outline'])
}

IconButton.defaultProps = {
    type: Platform.select({
        ios: "light",
        android: "solid",
        default: "solid"
    })
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
