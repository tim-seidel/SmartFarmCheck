import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';

import NoContentView from '../components/NoContentView';
import EvaluationListItemView from '../components/EvaluationListItemView';
import InformationCard, { InformationHighlight, InformationText } from '../components/InformationCard';
import Strings from '../constants/Strings';
import { HeadingText } from '../components/Text';
import { useThemeProvider } from '../ThemeContext';

const EvaluationScreen = (props) => {
    const { colorTheme } = useThemeProvider()
    const [evalulationState, setEvaluationState] = useState({ isLoaded: false, hasNetwork: true, error: null, errorCode: 0, evaluation: [] })

    useEffect(() => {
        if (!evalulationState.isLoaded) {
            checkAndEvaluate();
        }
    }, [evalulationState.isLoaded])

    function checkAndEvaluate() {
        if (!evalulationState.isLoaded) {

            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    evaluate()
                } else {
                    setEvaluationState({ isLoaded: true, hasNetwork: false, error: null, errorCode: 0, evaluation: [] })
                }
            });
        }
    }

    function evaluate() {
        const data = props.route.params;
        console.log("Sending input", data)

        fetch('https://pas.coala.digital/v1/evaluate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: data
        })
            .then(response => response.json())
            .then(json => {
                //Check for request errors
                if (json.status && json.status != 200) {
                    setEvaluationState({ isLoaded: true, hasNetwork: true, error: json, errorCode: json?.status ?? -1, evaluation: [] })
                } else {
                    //Otherwise asumed as correct (A valid server response doesn't return a 200, sadly)
                    setEvaluationState({ isLoaded: true, hasNetwork: true, error: null, errorCode: 0, evaluation: json })
                }
            })
            .catch(error => {
                console.log("Error", error)
                setEvaluationState.setState({ isLoaded: false, hasNetwork: true, error: error, errorCode: -1, evaluation: [] })
            })
    }

    function retryHandler() {
        setEvaluationState({ isLoaded: false, hasNetwork: true, error: null, errorCode: 0, evaluation: [] })
    }

    function measureSelectedHandler(uuid) {
        props.navigation.navigate("EvaluationDetail", uuid)
    }

    const { isLoaded, hasNetwork, error, errorCode, evaluation } = evalulationState

    if (error) {
        return <View style={{ ...styles.container, backgroundColor: colorTheme.background }}><NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.evaluation_loading_error + " (Fehlercode: " + errorCode + ")."}></NoContentView></View>
    } else if (!isLoaded) {
        return <View style={{ ...styles.container, backgroundColor: colorTheme.background }}><NoContentView icon="cloud-download" loading title={Strings.evaluation_loading}></NoContentView></View>
    } else if (!hasNetwork) {
        return <View style={{ ...styles.container, backgroundColor: colorTheme.background }}><NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.evaluation_loading_no_network}></NoContentView></View>
    } else if (!evaluation || evaluation.length === 0) {
        return <View style={{ ...styles.container, backgroundColor: colorTheme.background }}><NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.evaluation_loading_empty}></NoContentView></View>
    } else {
        let max = 0;
        evaluation.forEach(e => {
            if (e.rating > max) {
                max = e.rating
            }
        })
        return (
            <View style={{ ...styles.container, backgroundColor: colorTheme.background }} >
                <FlatList
                    style={styles.list}
                    data={evaluation}
                    ListHeaderComponent={
                        <View>
                            <InformationCard>
                                <InformationText>Hier sehen Sie die auf Basis Ihrer Antworten </InformationText>
                                <InformationHighlight style={styles.explanationHighlight}>gewichteten Maßnahmen</InformationHighlight>
                                <InformationText>. Möchten Sie sich über eine dieser Maßnahme informieren, so </InformationText>
                                <InformationHighlight>tippen</InformationHighlight>
                                <InformationText> Sie diese einfach an.</InformationText>
                            </InformationCard>
                            <HeadingText large weight="bold" style={styles.heading}>Ergebnisse:</HeadingText>
                        </View>}
                    renderItem={({ item }) => (
                        <EvaluationListItemView
                            key={item.uuid}
                            rating={Math.round((item.rating / max) * 100)}
                            title={item.name}
                            short={item.excerpt}
                            measureSelected={() => measureSelectedHandler(item.uuid)}
                        />
                    )}
                    keyExtractor={item => item.uuid}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    list: {
        margin: 8
    },
    heading: {
        marginStart: 2,
        marginTop: 16
    }
});

export default EvaluationScreen