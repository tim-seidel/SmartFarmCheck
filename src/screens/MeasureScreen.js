import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Platform, Dimensions, Linking, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector, useDispatch } from 'react-redux'
import * as Device from 'expo-device'
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme';

import RootView from '../components/common/RootView';
import NoContentView from '../components/common/NoContentView';
import MeasureListView from '../components/MeasureListView';
import MeasureView from '../components/MeasureView';
import IconButton from '../components/common/IconButton';
import { ContentText, HeadingText } from '../components/common/Text';

import { fetchMeasures } from '../store/actions/measures';
import Strings from '../constants/Strings';
import { MEASUREDETAILSCREEN, FORMSELECTSCREEN, VIDEOSCREEN, AUDIOSCREEN } from '../constants/Paths';
import Layout from '../constants/Layout';
import { darkTheme, lightTheme } from '../constants/Colors';

const IMAGE_UPATE_TIME = 15

const isPortrait = () => {
	const dim = Dimensions.get('screen');
	return dim.height >= dim.width;
};

const MeasureScreen = props => {
	const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

	const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape')
	const [isTablet, setIsTablet] = useState(Platform.isPad)

	const [isLoading, setIsLoading] = useState(false)
	const [hasNoNetwork, setHasNoNetwork] = useState(false)
	const [errorCode, setErrorCode] = useState(0)

	const dispatch = useDispatch()
	const measures = useSelector(state => state.measures.measures)
	const [isRotationEnabled, setRotationEnabled] = useState(false)
	const [selectedMeasure, setSelectedMeasure] = useState(undefined)

	const [measureFilters, setMeasureFilters] = useState(["Alle"])
	const [measureFilter, setMeasureFilter] = useState(0)
	const [filteredMeasures, setFilteredMeasures] = useState(measures)

	const images = [
		require("../../assets/images/digi/img_carousel_03.jpg"),
		require("../../assets/images/digi/img_carousel_05.jpg"),
		require("../../assets/images/digi/img_carousel_06.jpg")
	]
	const [imageRotationIndex, setImageRotationIndex] = useState(0)
	const navigation = props.navigation

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			setRotationEnabled(true)
		});

		return unsubscribe;
	}, [navigation]);

	useEffect(() => {
		const unsubscribe = navigation.addListener('blur', () => {
			setRotationEnabled(false)
		});

		return unsubscribe;
	}, [navigation]);

	useEffect(() => {
		if (!isRotationEnabled) return
		let timeout = undefined
		try {
			timeout = setTimeout(() => {
				setImageRotationIndex((imageRotationIndex + 1) % images.length)
			}, IMAGE_UPATE_TIME * 1000)

		} catch (e) {
			console.log("Error starting timeout", e)
		}
		return () => {
			if (timeout) clearTimeout(timeout)
		}
	}, [imageRotationIndex, isRotationEnabled])

	useEffect(() => {
		const callback = ({ screen }) => {
			setOrientation(screen.height >= screen.width ? 'portrait' : 'landscape')
		}
		const checkTablet = async () => {
			const type = await Device.getDeviceTypeAsync()
			setIsTablet(!(type === Device.DeviceType.PHONE || type === Device.DeviceType.UNKNOWN))
		}
		checkTablet()

		Dimensions.addEventListener('change', callback);
		return () => {
			Dimensions.removeEventListener('change', callback);
		};
	}, []);

	useEffect(() => {
		checkAndLoadMeasures()
	}, [checkAndLoadMeasures])

	function measureSelectedHandlerSplit(measure) {
		props.navigation.setOptions({ title: measure.name ? "Maßnahmendetails: " + measure.name : "Maßnahmenübersicht" })
		setSelectedMeasure(measure)
	}

	function measureSelectedHandlerList(measure) {
		props.navigation.navigate(MEASUREDETAILSCREEN, measure.uuid)
		setSelectedMeasure(measure)
	}

	function gotoFormSelectHandler() {
		props.navigation.navigate(FORMSELECTSCREEN)
	}

	function urlClickHandler(url) {
		if (url.includes('.mp4') || url.includes('.avi')) {
			props.navigation.navigate(VIDEOSCREEN, url)
		} else if (url.includes('.mp3')) {
			props.navigation.navigate(AUDIOSCREEN, url)
		}
		else {
			if (!url) return
			Linking.canOpenURL(url).then(can => {
				if (can) {
					Linking.openURL(url)
				}
			})
		}
	}

	const checkAndLoadMeasures = useCallback(async () => {
		const netinfo = await NetInfo.fetch()
		if (netinfo.isConnected) {
			setIsLoading(true)
			try {
				await dispatch(fetchMeasures())
			} catch (err) {
				console.log(err)
				setErrorCode(err.name === "AbortError" ? 6000 : (err.status ?? -1))
			}
			setIsLoading(false)
		} else {
			setHasNoNetwork(true)
		}
	}, [dispatch])

	function retryHandler() {
		setErrorCode(0)
		setHasNoNetwork(false)
		checkAndLoadMeasures()
	}

	function gotoFormSelectHandler() {
		props.navigation.navigate(FORMSELECTSCREEN)
	}

	useEffect(() => {
		const keywords = ["Alle"]
		measures.forEach(m => {
			m.keywords.forEach(k => {
				if (!keywords.includes(k)) {
					keywords.push(k)
				}
			})
		})
		setMeasureFilters(keywords)
	}, [measures])


    useEffect(() => {
        if (measureFilter == 0) {
			setFilteredMeasures(measures)
		} else {
			setFilteredMeasures(measures.filter(m => m.keywords.includes(measureFilters[measureFilter])))
		}
    }, [measures, measureFilter])

	function filterSelectedHandler(index) {
		setMeasureFilter(index)
	}

	const contentHeader =
		<View>
			<View component style={{ ...styles.digicheck, backgroundColor: colorTheme.componentBackground }}>
				<View component style={styles.digicheckColumn}>
					<Icon name="tractor-variant" color={colorTheme.textPrimary} size={36} />
					<View style={styles.digicheckHeading}>
						<HeadingText large weight="bold">{Strings.digicheck_title}</HeadingText>
					</View>
				</View>
				<Image source={images[imageRotationIndex]} style={styles.digicheckImage} />
				<ContentText light>{Strings.digicheck_content}</ContentText>
				<View style={styles.calculateButtonWrapper}>
					<IconButton
						type="solid"
						icon="format-list-checks"
						text={Strings.measure_navigate_evaluation}
						align="center"
						onPress={gotoFormSelectHandler} />
				</View>
			</View>
			<HeadingText large weight="bold" style={styles.listHeading}>{Strings.measure_all_measures_title}</HeadingText>
			<View style={styles.hastags}>
				{measureFilters.map((kw, index) => (<View key={kw} style={{...styles.hastag, backgroundColor: colorTheme.componentBackground}}>
					<ContentText onPress={() => filterSelectedHandler(index)} weight={index == measureFilter ? "bold" : "normal"}>{"#" + kw}</ContentText>
				</View>))}
			</View>
		</View>

	let isDisplayingMeasures = false

	var contentView = null
	if (errorCode !== 0) {
		contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.measure_loading_error + " (Fehlercode: " + errorCode + ")"} />
	} else if (isLoading) {
		contentView = <NoContentView icon="cloud-download" loading title={Strings.measure_loading} />
	} else if (hasNoNetwork && measures.length === 0) {
		contentView = <NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.measure_loading_no_network} />
	} else if (measures.length === 0) {
		contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.measure_loading_empty} />
	} else {
		isDisplayingMeasures = true
		if (isTablet) {
			let measureContent = null;
			if (selectedMeasure) {
				measureContent = <MeasureView measureId={selectedMeasure.uuid} onURLClicked={urlClickHandler} />
			} else {
				measureContent = <NoContentView icon="gesture-tap" title={Strings.measure_split_content_placeholder} />
			}

			contentView =
				<View style={styles.splitViewRow}>
					<View style={styles.masterColumn}>
						<MeasureListView
							itemStyle={styles.measure}
							header={contentHeader}
							measures={filteredMeasures}
							measureSelected={measureSelectedHandlerSplit} />
					</View>
					<View style={styles.detailColumn}>
						{measureContent}
					</View>
				</View>
		} else {
			contentView =
				<View style={styles.mainColumn}>
					<MeasureListView
						itemStyle={styles.measure}
						columns={orientation === 'landscape' ? 2 : 1}
						header={contentHeader}
						measures={filteredMeasures}
						measureSelected={measureSelectedHandlerList}
					/>
				</View>
		}
	}

	if (!isDisplayingMeasures) {
		return <RootView style={styles.noContent}>
			<ScrollView>
				{contentHeader}
				{contentView}
			</ScrollView>
		</RootView>
	} else {
		return <RootView>
			{contentView}
		</RootView>
	}
}

const styles = StyleSheet.create({
	noContent: {
		marginHorizontal: 4,
	},
	mainColumn: {
		flex: 1,
		marginHorizontal: 4
	},
	splitViewRow: {
		flexDirection: 'row',
		flex: 1,
		marginHorizontal: 4
	},
	masterColumn: {
		flex: 3
	},
	detailColumn: {
		flex: 5,
		marginHorizontal: -4
	},
	digicheck: {
		padding: 8,
		marginTop: 8,
		marginHorizontal: 4,
		borderColor: Layout.borderColor,
		borderWidth: Layout.borderWidth,
		borderRadius: Layout.borderRadius
	},
	digicheckColumn: {
		flexDirection: "row",
		alignItems: "center"
	},
	digicheckHeading: {
		marginStart: 8,
		flex: 1
	},
	digicheckImage: {
		width: "100%",
		height: 200,
		marginVertical: 4,
		alignSelf: 'center',
		backgroundColor: "white",
		borderRadius: Layout.borderRadius
	},
	listHeading: {
		marginVertical: 8,
		marginHorizontal: 4
	},
	calculateButtonWrapper: {
		marginTop: 8
	},
	measure: {
		flex: 1,
		marginBottom: 8,
		marginHorizontal: 4
	},
	hastags: {
		flexDirection: 'row',
		marginStart: 2,
		marginBottom: 6,
		flexWrap: "wrap",
		alignContent: "space-between"
	},
	hastag: {
		borderRadius: Layout.borderRadius,
		borderColor: Layout.borderColor,
		borderWidth: Layout.borderWidth,
		paddingHorizontal: 6,
		paddingVertical: 4,
		margin: 2
	}
});

export default MeasureScreen
