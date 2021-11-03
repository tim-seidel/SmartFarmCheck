import React from 'react'
import WebView from 'react-native-webview'

import RootView from '../components/common/RootView'

const AudioScreen = (props) => {
	const url = props.route.params

	return (
		<RootView>
			<WebView source={{ uri: url }}></WebView>
		</RootView>
	)
}

export default AudioScreen
