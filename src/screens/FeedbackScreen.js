import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useStateValue } from '../StateProvider'

const FeedbackScreen = (props) => {
    const [{colorTheme}] = useStateValue()

    return (
        <View style={{...styles.container, backgroundColor: colorTheme.background}}>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default FeedbackScreen;