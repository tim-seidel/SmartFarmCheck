import React from 'react'
import { View, StyleSheet } from 'react-native'
import {ColorTheme} from'../constants/Colors';


export default Separator = props => {
    return <View style={styles.separator}></View>
}

const styles = StyleSheet.create({
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: ColorTheme.current.grey,
    }
});
