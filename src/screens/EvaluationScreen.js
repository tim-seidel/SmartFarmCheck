import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';

import NoContentView from '../components/NoContentView';
import EvaluationListItemView from '../components/EvaluationListItemView';
import InformationCard, { InformationHighlight, InformationText } from '../components/InformationCard';

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
        this.evaluate();
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
                    console.log("received evaluation", json)
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
            return <NoContentView icon="emoticon-sad-outline" onRetry={this.onRetryHandler.bind(this)} title="Aktuell kann die Evaluierung nicht durchgeführt werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut."></NoContentView>
        } else if (!isLoaded) {
            return <NoContentView icon="cloud-download" loading title="Die Evaluierung wird durchgeführt..."></NoContentView>
        } else if (!evaluation || evaluation.length === 0) {
            return <NoContentView icon="emoticon-sad-outline" onRetry={this.onRetryHandler.bind(this)} title="Aktuell können die Fragen des Fragebogens nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut."></NoContentView>
        } else {
            let max = 0;
            evaluation.forEach(e => {
                if (e.rating > max) {
                    max = e.rating
                }
            })
            return (
                <View style={styles.container} >
                    <InformationCard style={styles.explanationCard}>
                        <InformationText>Hier sehen Sie die auf Basis Ihrer Antworten </InformationText>
                        <InformationHighlight style={styles.explanationHighlight}>gewichteten</InformationHighlight>
                        <InformationText> Maßnahmen. Möchten Sie sich über eine dieser Maßnahme informieren, so tippen Sie diese einfach an.</InformationText>
                    </InformationCard>
                    <Text style={styles.listHeading}>Die Bewertung:</Text>
                    <FlatList
                        data={evaluation}
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
        backgroundColor: '#fff',
    },
    explanationCard: {
        marginTop: 8,
        marginHorizontal: 8
    },
    listHeading: {
        fontSize: 26,
        fontWeight: "bold",
        marginTop: 8,
        marginHorizontal: 8
    }
});

// Wrap for navigation
export default function (props) {
    const navigation = useNavigation();
    const route = useRoute();

    return <EvaluationScreen {...props} route={route} navigation={navigation} />;
}
