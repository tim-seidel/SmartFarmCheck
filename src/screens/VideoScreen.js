import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useThemeProvider } from '../ThemeContext'
import WebView from 'react-native-webview'

const VideoScreen = (props) => {
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

export default VideoScreen;