import React from 'react'
import { StyleSheet } from 'react-native';
import { Video } from 'expo-av';

import RootView from '../components/common/RootView'
import WebView from 'react-native-webview';
import { useState } from 'react';
import NoContentView from '../components/common/NoContentView';
import Strings from '../constants/Strings';

const VideoScreen = (props) => {
    const [hasError, setHasError] = useState(false)

    function errorHandler(error){
        console.log(error)
        setHasError(true)
    }

    function backHandler(){
        props.navigation.pop()
    }

    const videoLink = props.route.params

    if (videoLink.includes('youtube') || videoLink.includes('youtu.be')) {
        return <RootView>
           <WebView source = {{ uri: videoLink }}/>
        </RootView>
    } else {
        if(hasError){
            return <NoContentView icon="emoticon-sad-outline" retryTitle={Strings.back} onRetry={backHandler} title={"Das Video kann leider nicht wiedergegeben werden."} />
        }else{
        return <RootView>
            <Video
                source={{ uri: videoLink }}
                rate={1.0}
                isMuted={false}
                useNativeControls
                resizeMode="contain"
                style={styles.backgroundVideo}
                onError={errorHandler}
            />
        </RootView>
        }
    }
}

var styles = StyleSheet.create({
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});

export default VideoScreen
