import React, { Component } from 'react';
import { Text, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../constants/Colors';

export default class IconButton extends Component {

    render() {
        const { icon, text, type } = this.props;
        return (
            <Icon.Button
                style={type === 'outline' ? styles.buttonOutlined : styles.button}
                name={icon}
                size={24}
                color={type === 'solid' ? Colors.white : Colors.primary}
                backgroundColor={type === 'solid' ? Colors.primary : Colors.white}
                onPress={this.props.onPress}
            >
                <Text
                    numberOfLines={1}
                    lineBreakMode="tail"
                    ellipsizeMode="tail"
                    style={{ fontSize: 16, color: type === 'solid' ? Colors.white : Colors.primary }}>
                    {text}
                </Text>
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