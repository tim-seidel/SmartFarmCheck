import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';

import NoContentView from '../components/NoContentView';
import EvaluationListItemView from '../components/EvaluationListItemView';
import InformationCard, { InformationHighlight, InformationText } from '../components/InformationCard';
import Strings from '../constants/Strings';
import { HeadingText } from '../components/Text';
import {ColorTheme} from'../constants/Colors';

class EvaluationScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            evaluation: []
        }
    }

    componentDidMount() {
        if (!this.state.isLoaded) {
            this.evaluate();
        }
    }

    evaluate() {
        const data = this.props.route.params;
        console.log("Sending input", data)

        if (!this.state.isLoaded) {
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
                    this.setState({
                        isLoaded: true,
                        evaluation: json,
                        error: null
                    })
                })
                .catch(error => {
                    console.log("Error", error)
                    this.setState({
                        isLoaded: false,
                        error: error
                    })
                })
        }
    }

    onRetryHandler() {
        this.setState({
            isLoaded: false,
            error: null
        }, this.evaluate.bind(this))
    }

    measureSelectedHandler(uuid) {
        this.props.navigation.navigate("EvaluationDetail", uuid)
    }

    render() {
        const { error, isLoaded, evaluation } = this.state;

        if (error) {
            return <View style={styles.container}><NoContentView icon="emoticon-sad-outline" onRetry={this.onRetryHandler.bind(this)} title={Strings.evaluation_loading_error}></NoContentView></View>
        } else if (!isLoaded) {
            return <View style={styles.container}><NoContentView icon="cloud-download" loading title={Strings.evaluation_loading}></NoContentView></View>
        } else if (!evaluation || evaluation.length === 0) {
            return <View style={styles.container}><NoContentView icon="emoticon-sad-outline" onRetry={this.onRetryHandler.bind(this)} title={Strings.evaluation_loading_empty}></NoContentView></View>
        } else {
            let max = 0;
            evaluation.forEach(e => {
                if (e.rating > max) {
                    max = e.rating
                }
            })
            return (
                <View style={styles.container} >
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
                                measureSelected={() => this.measureSelectedHandler(item.uuid)}
                            />
                        )}
                        keyExtractor={item => item.uuid}
                    />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorTheme.current.background
    },
    list: {
        margin: 8
    },
    heading: {
        marginStart: 2,
        marginTop: 16
    }
});

// Wrap for navigation
export default function (props) {
    const navigation = useNavigation();
    const route = useRoute();

    return <EvaluationScreen {...props} route={route} navigation={navigation} />;
}
