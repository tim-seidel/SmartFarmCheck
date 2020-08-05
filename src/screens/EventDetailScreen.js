import React from 'react'
import { View, StyleSheet } from 'react-native'
import WebView from 'react-native-webview'

import { useStateValue } from '../StateProvider'

const EventDetailScreen = (props) => {
    const [{colorTheme}] = useStateValue()
    const url = props.route.params
    return (
        <View style={{...styles.container, backgroundColor: colorTheme.background}}>
            <WebView source={{uri: url}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
})

export default EventDetailScreen;