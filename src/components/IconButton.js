import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';

import { ContentText } from './Text';
import { useStateValue } from '../StateProvider';
import { ConstantColors } from '../constants/Colors';

/**
 * A default button layout, that can be customized. 
 * Default styles:
 * - outline
 * - solid (filled)  <- default (on iOS transparent)
 * - light: transparent
 */
const IconButton = (props) =>{
        const [{colorTheme}] = useStateValue()

        const { icon, text, type } = props;
        return (
            <Icon.Button
                style={type === 'outline' ? {...styles.buttonOutlined, borderColor: colorTheme.primary} : styles.button}
                name={icon}
                size={24}
                color={type === 'solid' ? colorTheme.textPrimaryContrast : colorTheme.primary}
                backgroundColor={type === 'solid' ? colorTheme.primary : ConstantColors.transparent}
                underlayColor={ConstantColors.grey}
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
    },
    buttonOutlined: {
        borderWidth: 1.5,
        justifyContent: "center"
    }
})

export default IconButton