import React from 'react'
import { View, StyleSheet } from 'react-native'
import WebView from 'react-native-webview'

const EventDetailScreen = (props) => {
    const url = props.route.params
    return (
        <View style={styles.container}>
            <WebView source={{uri: url}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 8
    },
})

export default EventDetailScreen;