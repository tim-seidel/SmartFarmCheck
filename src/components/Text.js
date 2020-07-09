import React from 'react'
import { Text, Platform} from 'react-native'
import Colors from '../constants/Colors'

/**
 * This file contains the default text formats for the application.
 **/ 

//Constants

const text_size_heading = 19
const text_size_heading_large = 22

const text_size_content = 16 // Platform.isPas ? 18 : 16
const text_size_content_small = 15
const text_size_content_large = 17

const text_weight_heading =  Platform.OS === 'ios' ? '500' : '900'

const text_color = Colors.black
const text_color_light = Colors.grey
const text_color_error = Colors.error

//Components

export const HeadingText = (props) => {
    return (
            <Text {...props} style={[{
                fontWeight: props.weight ?? text_weight_heading,
                fontSize: props.large ? text_size_heading_large : text_size_heading,
                color: text_color
            }, props.style]}>{props.children}</Text>
    )
}

export const ContentText = (props) => {
    return (
            <Text {...props} style={[{
                color: props.error ? text_color_error : props.light ? text_color_light : text_color,
                fontSize: props.large ? text_size_content_large : props.small ? text_size_content_small : text_size_content
            }, props.style]}>{props.children}</Text>
    )
}