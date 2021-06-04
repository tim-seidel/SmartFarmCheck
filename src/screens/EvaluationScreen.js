import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, Dimensions, Platform, Linking } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import NetInfo from '@react-native-community/netinfo';
import * as Device from 'expo-device'

import RootView from '../components/common/RootView'
import NoContentView from '../components/common/NoContentView'
import EvaluationListView from '../components/EvaluationListView'
import MeasureView from '../components/MeasureView';
import { HeadingText } from '../components/common/Text'
import InformationCard, { InformationText } from '../components/common/InformationCard'

import Strings from '../constants/Strings'
import { fetchEvaluation } from '../store/actions/evaluation'
import { EVALUATIONDETAILSCREEN, CONTACTREQUESTSCREEN } from '../constants/Paths';
import { WrappedIconButton } from '../components/common/IconButton';

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
    const evaluation = useSelector(state => state.evaluation.evaluation)
    const [selectedRating, setSelectedRating] = useState(undefined)

    const { route } = props
    const { answers, formUuid } = route.params

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
    }, [checkAndEvaluate, answers])

    const checkAndEvaluate = useCallback(async () => {
        const netinfo = await NetInfo.fetch()
        if (netinfo.isConnected) {
            setIsLoading(true)
            try {
                await dispatch(fetchEvaluation(formUuid, answers))
            } catch (err) {
                console.log(err)
                setErrorCode(err.name === "AbortError" ? 6000 : (err.status ?? -1))
            }
            setIsLoading(false)
        } else {
            setHasNoNetwork(true)
        }
    }, [dispatch, answers])

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
            Linking.openURL(url)
        }
    }

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
            <HeadingText large weight="bold" style={styles.heading}>Ergebnisse:</HeadingText>
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
                    <EvaluationListView
                        columns={1}
                        style={styles.ratingListSplit}
                        ratings={evaluation.ratings}
                        ratingSelected={ratingSelectedHandlerSplit}
                    >
                        {informationHeader}
                    </EvaluationListView>
                    <View style={styles.measureViewSplit}>
                        {measureContent}
                    </View>
                </View>
        } else {
            contentView =
                <EvaluationListView
                    columns={orientation === 'landscape' ? 2 : 1}
                    style={styles.ratingList}
                    ratings={evaluation.ratings}
                    ratingSelected={ratingSelectedHandlerList}
                >
                    {informationHeader}
                </EvaluationListView>
        }
    }

    return (
        <RootView>
            {contentView}
        </RootView>
    )
}

const styles = StyleSheet.create({
    informationCard: {
        marginTop: 8,
        marginHorizontal: 4
    },
    heading: {
        marginTop: 16,
        marginBottom: 8,
        marginStart: 6
    },
    calculateButtonWrapper: {
        marginHorizontal: 8,
        marginTop: 4,
        marginBottom: 8
    },
    calculateButton: {
        justifyContent: "center"
    },
    splitViewRow: {
        flex: 1,
        flexDirection: 'row'
    },
    ratingList: {
        flex: 1,
        marginHorizontal: 4,
    },
    ratingListSplit: {
        flex: 1,
        marginHorizontal: 4,
    },
    measureViewSplit: {
        flex: 2,
        marginHorizontal: 4
    },
    mainColumn: {
        flex: 1,
        flexDirection: 'column'
    },
    helpButton: {
        marginBottom: 8,
        marginHorizontal: 8
    }
})

export default EvaluationScreen
