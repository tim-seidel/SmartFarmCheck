import React, {useState, useEffect} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import NoContentView from '../components/NoContentView';
import EvaluationListItemView from '../components/EvaluationListItemView';
import InformationCard, { InformationHighlight, InformationText } from '../components/InformationCard';
import Strings from '../constants/Strings';
import { HeadingText } from '../components/Text';
import { useStateValue } from '../StateProvider';

const EvaluationScreen = (props) => {
    const [{colorTheme}] = useStateValue()
    const [evalulationState, setEvaluationState] = useState({ error: null, isLoaded: false, evaluation: [] })

    useEffect(() => {
        if (!evalulationState.isLoaded) {
            evaluate();
        }
    }, [evalulationState.isLoaded])

    function evaluate() {
        const data = props.route.params;
        console.log("Sending input", data)

        if (!evalulationState.isLoaded) {
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
                    console.log("Received evaluation", json)
                    setEvaluationState({ isLoaded: true, evaluation: json, error: null })
                })
                .catch(error => {
                    console.log("Error", error)
                    setEvaluationState.setState({ isLoaded: false, error: error, evaluation: [] })
                })
        }
    }

    function onRetryHandler() {
        setEvaluationState({ isLoaded: false, error: null, evaluation: [] })
    }

    function measureSelectedHandler(uuid) {
        props.navigation.navigate("EvaluationDetail", uuid)
    }

    const { error, isLoaded, evaluation } = evalulationState

    if (error) {
        return <View style={{...styles.container, backgroundColor: colorTheme.background}}><NoContentView icon="emoticon-sad-outline" onRetry={onRetryHandler} title={Strings.evaluation_loading_error}></NoContentView></View>
    } else if (!isLoaded) {
        return <View style={{...styles.container, backgroundColor: colorTheme.background}}><NoContentView icon="cloud-download" loading title={Strings.evaluation_loading}></NoContentView></View>
    } else if (!evaluation || evaluation.length === 0) {
        return <View style={{...styles.container, backgroundColor: colorTheme.background}}><NoContentView icon="emoticon-sad-outline" onRetry={onRetryHandler} title={Strings.evaluation_loading_empty}></NoContentView></View>
    } else {
        let max = 0;
        evaluation.forEach(e => {
            if (e.rating > max) {
                max = e.rating
            }
        })
        return (
            <View style={{...styles.container, backgroundColor: colorTheme.background}} >
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