import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { WebView } from "react-native-webview"

export default function URLInterceptingWebview(props) {
    const webview = React.useRef(null)

    const navigationStateChangeHandler = navState => {
        const { url } = navState;
        if (!url || url === "about:blank") return;

        webview.current.stopLoading();
        Linking.openURL(url);
    }

    return (
        <WebView ref={webview} onNavigationStateChange={navigationStateChangeHandler} style={styles.webview} {...props}/>
    );
}

const styles = StyleSheet.create({
    webview: {
    },
  }
  );