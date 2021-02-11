import React, {useState, useCallback, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NetInfo from '@react-native-community/netinfo'

import NoContentView from './NoContentView'
import URLInterceptingWebview from '../components/URLInterceptingWebview'

import { useThemeProvider } from '../ThemeContext'
import { ConstantColors } from '../constants/Colors'
import Strings from '../constants/Strings'
import { fetchMeasure } from '../store/actions/measures'

const MeasureView = props => {
    const { colorTheme } = useThemeProvider()

    const measureId = props.measureId

    const [isLoading, setIsLoading] = useState(false)
    const [hasNoNetwork, setHasNoNetwork] = useState(false)
    const [errorCode, setErrorCode] = useState(0)

    const localMeasures = useSelector(state => state.measures.measures)
    const measure = localMeasures.find(m => m.uuid === measureId)
    const dispatch = useDispatch()

    useEffect(() => {
        checkAndLoadMeasure()
    }, [checkAndLoadMeasure, measureId])

    const checkAndLoadMeasure = useCallback(async () => {
        if (measure != null || measureId == null) {
            return
        }

        const netinfo = await NetInfo.fetch()
        if (netinfo.isConnected) {
            setIsLoading(true)
            try {
                await dispatch(fetchMeasure(measureId))
            } catch (err) {
                console.log(err)
                setErrorCode(err.status ?? -1)
            }
            setIsLoading(false)
        } else {
            setHasNoNetwork(true)
        }
    }, [dispatch, measureId])

    function retryHandler() {
        setErrorCode(0)
        setHasNoNetwork(false)
        checkAndLoadMeasure()
    }

    function onURLHandler(url) {
        if (props.onURLClicked) {
            props.onURLClicked(url);
        }
    }

    var contentView = null
    if (errorCode !== 0) {
        contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.evaluation_detail_loading_error + " (Fehlercode: " + errorCode + ")"} />
    } else if (isLoading || measure == null) {
        contentView = <NoContentView icon="cloud-download" loading title={Strings.evaluation_detail_loading} />
    } else if (hasNoNetwork && measure == null) {
        contentView = <NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.evaluation_detail_loading_no_network} />
    } else {
        const head = '<html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body {font-size: 110%; font-family: Arial; color: ' + colorTheme.textPrimary + ' } p{text-align: justify; hyphens: auto; }</style></head>'
        var content = '<h2>' + measure.name + '</h2>'
        content += measure.description ?? "<p>Leider wurde noch kein detaillierter Inhalt hinterlegt.</p>"

        measure.resources.forEach(r => {
            switch (r.mime) {
                case "image/jpeg":
                case "image/png":
                    const uri = "https://pas.coala.digital/v1/measures/" + measure.uuid + "/resource/" + r.name
                    content += "<img style=\"max-width: 100%\" src=\"" + uri + "\"/>" + "<p>Bild: " + r.description + "</>"
            }
        })
        const wrapped = head + '<body>' + content + '</body></html>'

        contentView =  <URLInterceptingWebview style={{ backgroundColor: ConstantColors.transparent }} onURLSelected={onURLHandler} source={{ html: wrapped }} />
    }

    return contentView
}

export default MeasureView
