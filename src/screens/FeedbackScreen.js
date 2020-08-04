import React from 'react'
import { View, StyleSheet } from 'react-native'
import {ColorTheme} from'../constants/Colors'

const FeedbackScreen = (props) => {

    return (
        <View style={styles.container}>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorTheme.current.background
    }
})

export default FeedbackScreen;