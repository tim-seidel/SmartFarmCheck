import React from 'react'
import { StyleSheet, ActionSheetIOS, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ContentText } from './Text'
import Colors from "../constants/Colors"
import Layout from '../constants/Layout'

const picker_placeholder = "[Keine Auswahl]"

const SelectInput = (props) => {

    function showIosPickerHandler() {
        const pickerOptions = [picker_placeholder, ...props.options ?? []]
        const noOptionIndex = 0
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: pickerOptions,
                destructiveButtonIndex: noOptionIndex
            },
            (buttonIndex) => {
                props.selectionChanged(buttonIndex !== noOptionIndex ? pickerOptions[buttonIndex] : '')
            }
        );
    }

    function clearPickerHandler() {
        props.selectionChanged('')
    }

    return (
        <View style={styles.pickerRow}>
            <TouchableOpacity style={styles.pickerTouchWrapper} onPress={showIosPickerHandler}>
                <ContentText style={{ color: props.input ? Colors.textPrimary : Colors.lightgrey }}>{props.input ? props.input : picker_placeholder ?? picker_placeholder}</ContentText>
            </TouchableOpacity>
            {!!props.input && <Icon style={styles.clearIcon} name={'close'} onPress={clearPickerHandler} size={20}></Icon>}
        </View>
    )
}

const styles = StyleSheet.create({
    pickerRow: {
        flexDirection: 'row',
        marginTop: 4,
        borderRadius: Layout.borderRadius,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderColor: Colors.grey
    },
    pickerTouchWrapper: {
        flex: 1
    },
    pickerHint: {
        color: Colors.grey
    },
    clearIcon: {
        paddingHorizontal: 8
    }

});

export default SelectInput;