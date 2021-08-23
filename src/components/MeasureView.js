import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NetInfo from '@react-native-community/netinfo'

import NoContentView from './common/NoContentView'
import URLInterceptingWebview from './common/URLInterceptingWebview'

import { fetchMeasure } from '../store/actions/measures'
import Strings from '../constants/Strings'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import { ConstantColors, darkTheme, lightTheme } from '../constants/Colors'
import Network from '../constants/Network'

const MeasureView = props => {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)
    const [hasNoNetwork, setHasNoNetwork] = useState(false)
    const [errorCode, setErrorCode] = useState(0)

    //Checks and loads the measure from the local state
    const measureId = props.measureId
    const localMeasures = useSelector(state => state.measures.measures)
    const measure = localMeasures.find(m => m.uuid === measureId)

    useEffect(() => {
        checkAndLoadMeasure()
    }, [checkAndLoadMeasure, measureId])

    /**
     * Method that loads the measure. It first checks if a local measure was already found.
     * Otherwise it starts the request for the specific measure. 
     * The data and view update is handled via react state updates.
     */
    const checkAndLoadMeasure = useCallback(async () => {
        if (measureId == null) {
            return
        }

        //Check update threshold
        if (measure != null) {
            const diff = Date.now() - measure.updateTime
            if (diff < Network.UPDATE_MEASURE_THRESHOLD) {
                console.log("Measure is ~ " + Number(diff / 1000 / 60).toFixed(0) + " minute(s) old. Using cached measure.")
                return
            }else{
                console.log("Measure is ~ " + Number(diff / 1000 / 60).toFixed(0) + " minute(s) old. Updating measure.")
            }
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
        contentView = < NoContentView icon="emoticon-sad-outline"
            onRetry={retryHandler}
            title={Strings.evaluation_detail_loading_error + " (Fehlercode: " + errorCode + ")"}
        />
    } else if (isLoading || measure == null) {
        contentView = < NoContentView icon="cloud-download"
            loading title={Strings.evaluation_detail_loading}
        />
    } else if (hasNoNetwork && measure == null) {
        contentView = < NoContentView icon="cloud-off-outline"
            onRetry={retryHandler}
            title={Strings.evaluation_detail_loading_no_network}
        />
    } else {
        contentView = < URLInterceptingWebview style={
            { backgroundColor: ConstantColors.transparent }
        }
            onURLSelected={onURLHandler}
            source={
                { html: formatHTML(measure, colorTheme) }
            }
        />
    }

    return contentView
}

function formatHTML(measure, colorTheme) {
    const head = '<html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body {font-size: 110%; font-family: Arial; color: ' + colorTheme.textPrimary + ' } p{text-align: justify; hyphens: auto; } a {word-break: break-all;}</style></head>'
    var heading = '<h2>' + measure.name + '</h2>'

    let description = measure.description ?? "<p>Leider wurde noch kein detaillierter Inhalt hinterlegt.</p>"
    description = description.replace(new RegExp("<img ", 'g'), "<img style=\"max-width: 100%\" ")
    description = description.replace(new RegExp("open=\"true\"", 'g'), "")

    const wrapped = head + '<body>' + heading + description + '</body></html>'
    return wrapped
}

/*
function formatHTML(measure, colorTheme) {
    const head = '<html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body {font-size: 110%; font-family: Arial; color: ' + colorTheme.textPrimary + ' } p{text-align: justify; hyphens: auto; }</style></head>'
    var content = '<h2>' + measure.name + '</h2>'
    content += measure.description ?? "<p>Leider wurde noch kein detaillierter Inhalt hinterlegt.</p>"

    measure.resources.forEach(r => {
        switch (r.mime) {
            case "image/jpeg":
            case "image/png":
                const uri = "https://pas.sei-farbenfroh.de/v1/measures/" + measure.uuid + "/resource/" + r.name

                content += "<img style=\"max-width: 100%\" src=\"" + uri + "\"/>"
                if (r.description) {
                    content += "<p>Bild: " + r.description + "</>"
                }
        }
    })
    const wrapped = head + '<body>' + content + '</body></html>'

    return wrapped
    
    return measure.description.replace("img src=", "img style=\"width: 25%\" src=")
}
*/

export default MeasureView