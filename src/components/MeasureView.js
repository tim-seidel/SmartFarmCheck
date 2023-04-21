import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NetInfo from '@react-native-community/netinfo'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'

import NoContentView from './common/NoContentView'
import URLInterceptingWebview from './common/URLInterceptingWebview'

import { fetchMeasure } from '../store/actions/measures'
import { ConstantColors, darkTheme, lightTheme } from '../constants/Colors'
import Network from '../constants/Network'
import Strings from '../constants/Strings'

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
				return
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

/**
 * @summary Formats the measure content and applys the HTML wrapper aswell as scaling, a title and dark/light mode.
 * @param {*} measure The measure to display
 * @param {*} colorTheme The colortheme (dark/light) to apply to the text/background
 * @returns The formatted HTML content
 */
function formatHTML(measure, colorTheme) {
	const head = '<html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body {font-size: 110%; font-family: Arial; color: ' + colorTheme.textPrimary + ' } p{text-align: justify; hyphens: auto; } a {word-break: break-all;}</style></head>'
	var heading = '<h3>' + measure.name + '</h3>'

	let description = measure.description ? measure.description : "<p style=\"font-style: italic\">" + Strings.measure_detail_no_content +"</p>"
	description = description.replace(new RegExp("<img ", 'g'), "<img style=\"max-width: 100%\" ")
	description = description.replace(new RegExp("open=\"true\"", 'g'), "")

	const wrapped = head + '<body>' + heading + description + '</body></html>'
	return wrapped
}

export default MeasureView
