import React from 'react'
import { Linking } from 'react-native'

import RootView from '../components/RootView'
import MeasureView from '../components/MeasureView'

import { VIDEOSCREEN, AUDIOSCREEN } from '../constants/Paths'

const EvaluationDetailScreen = (props) => {
    const navigation = props.navigation
    const measureId = props.route.params

    function onURLHandler(url) {
        if (url.includes('.mp4') || url.includes('.avi')) {
            navigation.navigate(VIDEOSCREEN, url)
        } else if (url.includes('.mp3')) {
            navigation.navigate(AUDIOSCREEN, url)
        }
        else {
            Linking.openURL(url)
        }
    }

    return (
        <RootView>
            <MeasureView measureId={measureId} onURLClicked={onURLHandler} />
        </RootView>
    )
}

export default EvaluationDetailScreen
