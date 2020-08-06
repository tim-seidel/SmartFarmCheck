import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useStateValue } from '../StateProvider'
import WebView from 'react-native-webview'

const AudioScreen = (props) => {
    const [{ colorTheme }] = useStateValue()
    const url = props.route.params

    return (
        <View style={{ ...styles.container, backgroundColor: colorTheme.background }}>
            <WebView source={{ uri: url }}></WebView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default AudioScreen;