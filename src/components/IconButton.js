import React, { Component } from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';

import Colors from '../constants/Colors';
import { ContentText } from './Text';

/**
 * A default button layout, that can be customized. 
 * Default styles:
 * - outline
 * - solid (filled)  <- default (on iOS transparent)
 * - light: transparent
 */
export default class IconButton extends Component {
    render() {
        const { icon, text, type } = this.props;
        return (
            <Icon.Button
                style={type === 'outline' ? styles.buttonOutlined : styles.button}
                name={icon}
                size={24}
                color={type === 'solid' ? Colors.white : Colors.primary}
                backgroundColor={type === 'solid' ? Colors.primary : Colors.transparent}
                underlayColor={Colors.lightgrey}
                onPress={this.props.onPress}>
                <ContentText
                    numberOfLines={1}
                    lineBreakMode="tail"
                    ellipsizeMode="tail"
                    style={{ color: type === 'solid' ? Colors.white : Colors.primary }}>
                    {text}
                </ContentText>
            </Icon.Button>
        )
    }
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
        borderColor: Colors.primary,
        borderWidth: 1.5,
        justifyContent: "center"
    }
})