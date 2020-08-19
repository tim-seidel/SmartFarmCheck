import React, { useState, useEffect } from 'react'
import NetInfo from '@react-native-community/netinfo'

import NoContentView from '../components/NoContentView'
import URLInterceptingWebview from '../components/URLInterceptingWebview'
import { useThemeProvider } from '../ThemeContext'
import Strings from '../constants/Strings'
import { ConstantColors } from '../constants/Colors'
import RootView from '../components/RootView'

const EvaluationDetailScreen = (props) => {
    const { colorTheme } = useThemeProvider()
    const [measureState, setMeasureState] = useState({ isLoaded: false, hasNetwork: true, error: null, errorCode: 0, measure: null })

    useEffect(() => {
        if (!measureState.isLoaded) {
            checkAndLoadMeasure()
        }
    }, [measureState.isLoaded])

    function checkAndLoadMeasure() {
        if (!measureState.isLoaded) {

            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    loadMeasure()
                } else {
                    setMeasureState({ isLoaded: true, error: null, errorCode: 0, hasNetwork: false, measure: null })
                }
            })
        }
    }

    function loadMeasure() {
        const measureId = props.route.params

        fetch('https://pas.coala.digital/v1/measures/' + measureId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(response => response.json())
            .then(json => {
                //Check for request errors
                if (json.status && json.status != 200) {
                    setMeasureState({ isLoaded: true, hasNetwork: true, error: json, errorCode: json.status ?? -1, measure: null })
                } else {
                    //Otherwise asumed as correct (A valid server response doesn't return a 200, sadly)
                    setMeasureState({ isLoaded: true, hasNetwork: true, error: null, errorCode: 0, measure: json })
                }
            })
            .catch(error => {
                console.log("Error", error)
                setMeasureState({ isLoaded: true, hasNetwork: true, error: error, errorCode: -1, measure: null })
            })
    }

    function retryHandler() {
        setMeasureState({ isLoaded: false, hasNetwork: true, error: false, errorCode: 0, measure: null })
    }

    const { isLoaded, hasNetwork, error, errorCode, measure } = measureState
    var contentView = null
    if (error) {
        contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.evaluation_detail_loading_no_network + " (Fehlercode: " + errorCode + ")"} />
    } else if (!isLoaded) {
        contentView = <NoContentView icon="cloud-download" loading title={Strings.evaluation_detail_loading} />
    } else if (!hasNetwork) {
        contentView = <NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.evaluation_detail_loading_no_network} />
    } else {
        const head = '<html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body {font-size: 110%; font-family: Arial; color:  ' + colorTheme.textPrimary + '} p{text-align: justify; hyphens: auto; }</style></head>'
        var content = measure?.description ?? "<p>Leider wurde noch kein detaillierter Inhalt hinterlegt.</>"

        if (measure?.resources) {
            measure.resources.forEach(r => {
                switch (r.mime) {
                    case "image/jpeg":
                    case "image/png":
                        const uri = "https://pas.coala.digital/v1/measures/" + measure.uuid + "/resource/" + r.name
                        content += "<img style=\"max-width: 100%\" src=\"" + uri + "\"/>" + "<p>Bild: " + r.description + "</>"
                }
            })
        }

        const wrapped = head + '<body>' + content + '</body></html>'

        const navigation = props.navigation
        function onURLHandler(url) {
            if (url.includes('.mp4') || url.includes('.avi')) {
                navigation.navigate('Video', url)
            } else if (url.includes('.mp3')) {
                navigation.navigate('Audio', url)
            }
            else {
                Linking.openURL(url)
            }
        }

        contentView = <URLInterceptingWebview style={{ backgroundColor: ConstantColors.transparent }} onURLSelected={onURLHandler} source={{ html: wrapped }} />
    }

    return (
        <RootView>
            {contentView}
        </RootView>
    )
}

export default EvaluationDetailScreen
