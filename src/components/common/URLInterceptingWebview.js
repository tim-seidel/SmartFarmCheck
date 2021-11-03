import React from 'react'
import { WebView } from "react-native-webview"

/**
 * @summary A wrapper for webviews that can intercept clicks on links inside the content.
 * @param {Object} props The standard react native ui props 
 */
export default function URLInterceptingWebview(props) {

	const navigationStateChangeHandler = request => {
		const { url } = request
		if (!url || url === "about:blank") return true

		if (props.onURLSelected) {
			props.onURLSelected(url)
			return false
		}
		return true
	}

	return (
		<WebView onShouldStartLoadWithRequest={navigationStateChangeHandler} {...props} />
	)
}
