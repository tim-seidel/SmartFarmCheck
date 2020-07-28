import React from 'react'
import { View, Picker, StyleSheet } from 'react-native'
import Colors from "../constants/Colors"
import Layout from '../constants/Layout'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const picker_placeholder = "[Keine Auswahl]"

const SelectInput = (props) => {
    let items = props.options.map((opt, index) => {
        return <Picker.Item value={opt} key={index} label={opt}></Picker.Item>
    });

    function clearPicker(){
        props.selectionChanged('')
    }

    return (
        <View style={styles.pickerContainer}>
            <Picker style={props.input ? {flex: 1, color: Colors.textPrimary} : {flex: 1, color: Colors.lightgrey}} selectedValue={props.input} onValueChange={props.selectionChanged}>
                <Picker.Item value="" label={picker_placeholder} key="defaultOption"></Picker.Item>
                {items}
            </Picker>
            {!!props.input && <Icon style={{paddingHorizontal: 8, alignSelf: 'center'}} name={'close'} onPress={() => clearPicker()} size={24}></Icon>}
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
    pickerHint: {
        color: Colors.grey,
    },
});

export default SelectInput;