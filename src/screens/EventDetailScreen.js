import React from 'react'
import WebView from 'react-native-webview'

import RootView from '../components/RootView'

const EventDetailScreen = (props) => {
    const url = props.route.params
    return (
        <RootView>
            <WebView source={{ uri: url }} />
        </RootView>
    )
}

export default EventDetailScreen
