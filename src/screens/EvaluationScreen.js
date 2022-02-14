import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, Dimensions, Platform, Linking, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import NetInfo from '@react-native-community/netinfo';
import * as Device from 'expo-device'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import RootView from '../components/common/RootView'
import NoContentView from '../components/common/NoContentView'
import EvaluationListView from '../components/EvaluationListView'
import MeasureView from '../components/MeasureView';
import { ContentText, HeadingText } from '../components/common/Text'
import InformationCard, { InformationText } from '../components/common/InformationCard'
import { WrappedIconButton } from '../components/common/IconButton';

import Strings from '../constants/Strings'
import { fetchEvaluation } from '../store/actions/evaluation'
import { EVALUATIONDETAILSCREEN, CONTACTREQUESTSCREEN } from '../constants/Paths';
import Layout from '../constants/Layout';

const isPortrait = () => {
	const dim = Dimensions.get('screen');
	return dim.height >= dim.width;
};

const EvaluationScreen = (props) => {
	const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape')
	const [isTablet, setIsTablet] = useState(Platform.isPad)

	const [isLoading, setIsLoading] = useState(false)
	const [hasNoNetwork, setHasNoNetwork] = useState(false)
	const [errorCode, setErrorCode] = useState(0)

	const dispatch = useDispatch()
	const measures = useSelector(state => state.measures.measures)
	const evaluation = useSelector(state => state.evaluation.evaluation)
	const [selectedRating, setSelectedRating] = useState(undefined)

	const { route } = props
	const { formUuid, questions, answers } = route.params

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
		checkAndEvaluate()
	}, [checkAndEvaluate, answers, measures])

	const checkAndEvaluate = useCallback(async () => {
		const netinfo = await NetInfo.fetch()
		if (netinfo.isConnected) {
			setIsLoading(true)
			try {
				await dispatch(fetchEvaluation(formUuid, questions, answers, measures))
			} catch (err) {
				console.log(err)
				setErrorCode(err.name === "AbortError" ? 6000 : (err.status ?? -1))
			}
			setIsLoading(false)
		} else {
			setHasNoNetwork(true)
		}
	}, [dispatch, answers, measures])

	function retryHandler() {
		setErrorCode(0)
		setHasNoNetwork(false)
		checkAndEvaluate()
	}

	function contactRequestHandler() {
		if (!isLoading) {
			props.navigation.navigate(CONTACTREQUESTSCREEN, { answers: answers, formUuid: formUuid })
		}
	}

	function ratingSelectedHandlerSplit(rating) {
		props.navigation.setOptions({ title: rating.name ? "Maßnahmendetails: " + rating.name : "Empfehlungsübersicht" })
		setSelectedRating(rating)
	}

	function ratingSelectedHandlerList(rating) {
		props.navigation.navigate(EVALUATIONDETAILSCREEN, rating.uuid)
		setSelectedRating(rating)
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
				} else {
					Alert.alert(Strings.measure_resource_open_error_title, Strings.measure_resource_open_error_description, [
						{ text: Strings.okay, onPress: () => { } },
					]);
				}
			})
		}
	}

	const percentage_answered = Math.min(Math.ceil(answers.length / questions.length * 100), 100)

	var contentView = null
	if (errorCode !== 0) {
		contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.evaluation_loading_error + " (Fehlercode: " + errorCode + ")."} />
	} else if (isLoading) {
		contentView = <NoContentView icon="cloud-download" loading title={Strings.evaluation_loading} />
	} else if (hasNoNetwork && (!evaluation || evaluation.ratings.length === 0)) {
		contentView = <NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.evaluation_loading_no_network} />
	} else if (!evaluation || evaluation.ratings.length === 0) {
		contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.evaluation_loading_empty} />
	} else {
		const contactButton = <WrappedIconButton style={styles.helpButton} icon="email-outline" text={Strings.evaluation_help} onPress={contactRequestHandler} />

		const informationHeader = <View>
			<InformationCard title={Strings.evaluation_information_title} style={styles.informationCard} contentView={contactButton}>
				<InformationText>{Strings.evaluation_information_text}</InformationText>
			</InformationCard>
			<HeadingText large weight="bold" style={styles.listHeading}>Ergebnisse:</HeadingText>
			{percentage_answered < 80 &&
				<View style={styles.warningRow}>
					<Icon color="orange" name="alert-outline" size={28} />
					<ContentText large style={styles.warningText} >Sie haben ein Teil der Fragen nicht beantwortet. Die Bewertung kann dadurch ungenauer sein.</ContentText>
				</View>}
		</View>

		if (isTablet) {
			let measureContent = null;
			if (selectedRating) {
				measureContent = <MeasureView measureId={selectedRating.uuid} onURLClicked={urlClickHandler} />
			} else {
				measureContent = <NoContentView icon="gesture-tap" title={Strings.evaluation_split_content_placeholder} />
			}

			contentView =
				<View style={styles.splitViewRow}>
					<View style={styles.masterColumn}>
						<EvaluationListView
							itemStyle={styles.measureRating}
							ratings={evaluation.ratings}
							ratingSelected={ratingSelectedHandlerSplit}
							header={informationHeader}>
						</EvaluationListView>
					</View>

					<View style={styles.detailColumn}>
						{measureContent}
					</View>
				</View>
		} else {
			contentView =
				<View style={styles.mainColumn}>
					<EvaluationListView
						itemStyle={styles.measureRating}
						ratings={evaluation.ratings}
						header={informationHeader}
						ratingSelected={ratingSelectedHandlerList} />
				</View>
		}
	}

	return (
		<RootView>
			{contentView}
		</RootView>
	)
}

const styles = StyleSheet.create({
	mainColumn: {
		flex: 1,
		marginHorizontal: 4
	},
	splitViewRow: {
		flex: 1,
		flexDirection: 'row',
		marginHorizontal: 4
	},
	masterColumn: {
		flex: 3,
	},
	detailColumn: {
		flex: 5,
		marginHorizontal: -4
	},
	informationCard: {
		marginTop: 8,
		marginHorizontal: 4
	},
	listHeading: {
		marginVertical: 8,
		marginHorizontal: 4
	},
	helpButton: {
		marginBottom: 8,
		marginHorizontal: 8
	},
	measureRating: {
		flex: 1,
		marginBottom: 8,
		marginHorizontal: 4
	},
	warningRow: {
		flex: 1,
		marginHorizontal: 4,
		marginBottom: 8,
		flexDirection: 'row',
		borderColor: Layout.borderColor,
		borderRadius: Layout.borderRadius,
		borderWidth: Layout.borderWidth,
		padding: 8
	},
	warningText: {
		marginStart: 8
	}
})

export default EvaluationScreen
