import React from 'react'
import { View, Picker, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from '../constants/Colors'
import Layout from '../constants/Layout'

const picker_placeholder = "[Keine Auswahl]"

const SelectInput = (props) => {
    let items = props.options != null ? props.options.map((option, index) => {
        return <Picker.Item value={opt} key={index} label={option}></Picker.Item>
    }) : [];

    function clearPickerHandler() {
        props.selectionChanged('')
    }

    return (
        <View style={styles.pickerContainer}>
            <Picker style={{ flex: 1, color: props.input ? Colors.textPrimary : Colors.lightgrey }} selectedValue={props.input} onValueChange={props.selectionChanged}>
                <Picker.Item value="" label={props.placeholder ?? picker_placeholder} key="defaultOption"></Picker.Item>
                {items}
            </Picker>
            {!!props.input && <Icon style={styles.clearIcon} name={'close'} onPress={clearPickerHandler} size={24}></Icon>}
        </View>
    )
}

const styles = StyleSheet.create({
    pickerContainer: {
        flexDirection: 'row',
        marginTop: 4,
        borderRadius: Layout.borderRadius,
        borderWidth: 1,
        borderColor: Colors.grey
    },
    clearIcon: {
        paddingHorizontal: 8,
        alignSelf: 'center'
    },
    pickerHint: {
        color: Colors.grey,
    },
});

export default SelectInput;