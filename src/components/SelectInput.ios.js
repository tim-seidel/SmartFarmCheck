import React from 'react'
import { StyleSheet, ActionSheetIOS, TouchableOpacity, Text } from 'react-native'

import Colors from "../constants/Colors"

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
            <Text style={props.input ? styles.pickerPlaceholderText : styles.pickerPlaceholderHint}>{props.input ? props.input : picker_placeholder}</Text>
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
    pickerPlaceholderText: {
        fontSize: 17,
    },
    pickerPlaceholderHint: {
        fontSize: 17,
        color: Colors.greyInactive
    },
});

export default SelectInput;