import React from 'react'
import { View, Picker, StyleSheet } from 'react-native'
import Colors from "../constants/Colors"
import Layout from '../constants/Layout'

const picker_placeholder = "[Keine Auswahl]"

const SelectInput = (props) => {
    let items = props.options.map((opt, index) => {
        return <Picker.Item value={opt} key={index} label={opt}></Picker.Item>
    });

    return (
        <View style={styles.pickerContainer}>
            <Picker style={props.input ? {color: Colors.textPrimary} : {color: Colors.lightgrey}} selectedValue={props.input} onValueChange={props.selectionChanged}>
                <Picker.Item value="" label={picker_placeholder} key="defaultOption"></Picker.Item>
                {items}
            </Picker>
        </View>
    )
}

const styles = StyleSheet.create({
    pickerContainer: {
        marginTop: 4,
        borderRadius: Layout.borderRadius,
        borderWidth: 1,
        borderColor: Colors.grey
    },
    pickerHint: {
        color: Colors.grey,
    },
});

export default SelectInput;