import React from 'react';
import { WebView } from "react-native-webview"

export default function URLInterceptingWebview(props) {
    const webview = React.useRef(null)

    const navigationStateChangeHandler = request => {
        const { url } = request;
        if (!url || url === "about:blank") return true;

        if (props.onURLSelected) {
            props.onURLSelected(url)
            return false
        }
        return true
    }

    return (
        <WebView ref={webview} onShouldStartLoadWithRequest={navigationStateChangeHandler} {...props} />
    );
}