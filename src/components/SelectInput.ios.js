import React from 'react'
import { StyleSheet, ActionSheetIOS, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Colors from "../constants/Colors"
import { ContentText } from './Text'
import Layout from '../constants/Layout'

const picker_placeholder = "[Keine Auswahl]"

const SelectInput = (props) => {

    function showIosPicker(options) {
        const pickerOptions = [picker_placeholder, ...options]
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

    function clearPicker(){
        props.selectionChanged('')
    }

    return (
        <View style={styles.pickerRow}>
            <TouchableOpacity style={{flex: 1}} onPress={() => showIosPicker(props.options)}>
                <ContentText style={props.input ? {} : styles.inactive}>{props.input ? props.input : picker_placeholder}</ContentText>
            </TouchableOpacity> 
           {!!props.input && <Icon style={{paddingHorizontal: 8}} name={'close'} onPress={() => clearPicker()} size={20}></Icon>}
        </View>
    )
}

const styles = StyleSheet.create({
    pickerRow:{
        flexDirection: 'row',
        marginTop: 4,
        borderRadius: Layout.borderRadius,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderColor: Colors.grey
    },
    inactive: {
        color: Colors.grey
    }
});

export default SelectInput;