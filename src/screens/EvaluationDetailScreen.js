import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NetInfo from '@react-native-community/netinfo'

import NoContentView from '../components/NoContentView'
import URLInterceptingWebview from '../components/URLInterceptingWebview'
import { useThemeProvider } from '../ThemeContext'
import Strings from '../constants/Strings'
import { ConstantColors } from '../constants/Colors'
import RootView from '../components/RootView'
import { fetchMeasure } from '../store/actions/measures'
import { VIDEOSCREEN, AUDIOSCREEN } from '../constants/Paths'

const EvaluationDetailScreen = (props) => {
    const measureId = props.route.params

    const [isLoading, setIsLoading] = useState(false)
    const [hasNoNetwork, setHasNoNetwork] = useState(false)
    const [errorCode, setErrorCode] = useState(0)

    const { colorTheme } = useThemeProvider()

    const dispatch = useDispatch()
    const localMeasures = useSelector(state => state.measures.measures)
    const measure = localMeasures.find(m => m.uuid === measureId)

    useEffect(() => {
        checkAndLoadMeasure()
    }, [checkAndLoadMeasure])

    const checkAndLoadMeasure = useCallback(async () => {
        if (measure != null) {
            return
        }

        const netinfo = await NetInfo.fetch()
        if (netinfo.isConnected) {
            setIsLoading(true)
            try {
                await dispatch(fetchMeasure(measureId))
            } catch (err) {
                setErrorCode(err.status ?? -1)
            }
            setIsLoading(false)
        } else {
            setHasNoNetwork(true)
        }
    }, [dispatch])

    function retryHandler() {
        setErrorCode(0)
        setHasNoNetwork(false)
        checkAndLoadMeasure()
    }

    var contentView = null
    if (errorCode !== 0) {
        contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.evaluation_detail_loading_no_network + " (Fehlercode: " + errorCode + ")"} />
    } else if (isLoading) {
        contentView = <NoContentView icon="cloud-download" loading title={Strings.evaluation_detail_loading} />
    } else if (hasNoNetwork && measure === null) {
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
                navigation.navigate(VIDEOSCREEN, url)
            } else if (url.includes('.mp3')) {
                navigation.navigate(AUDIOSCREEN, url)
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
