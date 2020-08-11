import React from 'react'
import { View, StyleSheet } from 'react-native'
import WebView from 'react-native-webview'

import { useThemeProvider } from '../ThemeContext'

const AudioScreen = (props) => {
    const { colorTheme } = useThemeProvider()
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

export default AudioScreen
