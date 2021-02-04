import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import Layout from '../constants/Layout'
import { useThemeProvider } from '../ThemeContext'

const picker_placeholder = "[Keine Auswahl]"

const SelectInput = (props) => {
    const { colorTheme } = useThemeProvider()

    let items = props.options != null ? props.options.map((option, index) => {
        return <Picker.Item value={option} key={index} label={option}></Picker.Item>
    }) : []

    function clearPickerHandler() {
        props.selectionChanged('')
    }

    return (
        <View style={{...styles.pickerContainer, backgroundColor: colorTheme.background}}>
            <Picker style={{ flex: 1, color: props.input ? colorTheme.textPrimary : colorTheme.textHint }} selectedValue={props.input} onValueChange={props.selectionChanged}>
                <Picker.Item value="" label={props.placeholder ?? picker_placeholder} key="defaultOption"></Picker.Item>
                {items}
            </Picker>
            {!!props.input && <Icon style={{ ...styles.clearIcon, color: colorTheme.textPrimary }} name={'close'} onPress={clearPickerHandler} size={24}></Icon>}
        </View>
    )
}

const styles = StyleSheet.create({
    pickerContainer: {
        flexDirection: 'row',
        marginTop: 4,
        borderRadius: Layout.borderRadius,
        borderWidth: 1,
        borderColor: Layout.borderColor
    },
    clearIcon: {
        paddingHorizontal: 8,
        alignSelf: 'center',
    }
})

export default SelectInput
