import React from 'react'
import { StyleSheet, ActionSheetIOS, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { ContentText } from './common/Text'
import Layout from '../constants/Layout'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import { darkTheme, lightTheme } from '../constants/Colors'

const picker_placeholder = "[Keine Auswahl]"

const SelectInput = (props) => {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

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
        )
    }

    function clearPickerHandler() {
        props.selectionChanged('')
    }

    return (
        <View style={{...styles.pickerRow, backgroundColor: colorTheme.background}}>
            <TouchableOpacity style={styles.pickerTouchWrapper} onPress={showIosPickerHandler}>
                <ContentText style={{ color: props.input ? colorTheme.textPrimary : colorTheme.textHint }}>{props.input ? props.input : picker_placeholder ?? picker_placeholder}</ContentText>
            </TouchableOpacity>
            {!!props.input && <Icon style={{ ...styles.clearIcon, color: colorTheme.textPrimary }} name={'close'} onPress={clearPickerHandler} size={20}></Icon>}
        </View>
    )
}

const styles = StyleSheet.create({
    pickerRow: {
        flexDirection: 'row',
        marginTop: 4,
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderRadius: Layout.borderRadius,
        borderWidth: 1,
        borderColor: Layout.borderColor
    },
    pickerTouchWrapper: {
        flex: 1
    },
    clearIcon: {
        paddingHorizontal: 8
    }

})

export default SelectInput
