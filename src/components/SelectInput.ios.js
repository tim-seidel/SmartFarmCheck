import React from 'react'
import { StyleSheet, ActionSheetIOS, TouchableOpacity, Text } from 'react-native'

import Colors from "../constants/Colors"
import { ContentText } from './Text'

const picker_placeholder = "[Keine Auswahl]"

const SelectInput = (props) => {

    function showIosPicker(options) {
        const pickerOptions = [picker_placeholder, ...options,]
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: pickerOptions,
                destructiveButtonIndex: 0
            },
            (buttonIndex) => {
                props.selectionChanged(buttonIndex !== 0 ? pickerOptions[buttonIndex] : '')
            }
        );
    }

    return (
        <TouchableOpacity style={styles.pickerPlaceholder} onPress={() => showIosPicker(props.options)}>
            <ContentText style={props.input ? {} : styles.inactive}>{props.input ? props.input : picker_placeholder}</ContentText>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    pickerPlaceholder: {
        marginTop: 4,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderColor: Colors.greyInactive
    },
    inactive: {
        color: Colors.greyInactive
    }
});

export default SelectInput;