import React from 'react'
import { View, Picker, StyleSheet } from 'react-native'
import Colors from "../constants/Colors"

const picker_placeholder = "[Keine Auswahl]"

const SelectInput = (props) => {
    let items = props.options.map((opt, index) => {
        return <Picker.Item value={opt} key={index} label={opt}></Picker.Item>
    });

    return (
        <View style={styles.pickerContainer}>
            <Picker style={props.input ? styles.pickerText : styles.pickerHint} selectedValue={props.input} onValueChange={props.selectionChanged}>
                <Picker.Item value="" label={picker_placeholder} key="defaultOption"></Picker.Item>
                {items}
            </Picker>
        </View>
    )
}

const styles = StyleSheet.create({
    pickerContainer: {
        marginTop: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.greyInactive
    },
    pickerHint: {
        color: Colors.greyInactive,
        fontSize: 17
    },
    pickerText: {
        fontSize: 17,
        color: Colors.black
    }
});

export default SelectInput;