import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import NoContentView from '../components/NoContentView';
import URLInterceptingWebview from '../components/URLInterceptingWebview';
import InformationCard, { InformationHighlight, InformationText } from "../components/InformationCard"

class EvaluationDetailScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            measure: null
        }
    }

    componentDidMount() {
        this.loadMeasure();
    }

    loadMeasure() {
        const measureId = this.props.route.params;

        if (!this.state.isLoaded) {
            fetch('https://pas.coala.digital/v1/measures/' + measureId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
                .then(response => response.json())
                .then(json => {
                    this.setState({
                        isLoaded: true,
                        measure: json,
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
        }, this.loadMeasure.bind(this));
    }

    render() {
        const { error, isLoaded, measure } = this.state;

        if (error) {
            return <NoContentView icon="emoticon-sad-outline" onRetry={this.onRetryHandler.bind(this)} title="Aktuell kann die Maßnahme leider nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut."></NoContentView>
        } else if (!isLoaded) {
            return <NoContentView icon="cloud-download" loading title="Die Evaluierung wird durchgeführt..."></NoContentView>
        } else {
            const head = '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>'
            const content = measure.description ?? "<p>Leider wurde noch kein detaillierter Inhalt hinterlegt.</>"
            const wrapped = head + '<body>' + content + '</body></html>'

            this.props.navigation.setOptions({
                title: measure?.name ?? "Maßnahmeninformation"
            })

            return (
                <View style={styles.container}>
                    <URLInterceptingWebview source={{ html: wrapped }} />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    }
});

// Wrap for navigation
export default function (props) {
    const navigation = useNavigation();

    return <EvaluationDetailScreen {...props} navigation={navigation} />;
}

