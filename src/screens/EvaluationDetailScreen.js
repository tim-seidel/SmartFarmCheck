import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import NoContentView from '../components/NoContentView';
import URLInterceptingWebview from '../components/URLInterceptingWebview';

const EvaluationDetailScreen = (props) => {

    const [measureState, setMeasureState] = useState({ isLoaded: false, error: null, errorCode: 0, measure: null })

    useEffect(() => {
        if (!measureState.isLoaded) {
            loadMeasure();
        }
    }, [measureState.isLoaded])

    function loadMeasure() {
        const measureId = props.route.params;

        if (!measureState.isLoaded) {
            fetch('https://pas.coala.digital/v1/measures/' + measureId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                }
            })
                .then(response => response.json())
                .then(json => {
                    //Check for request errors
                    if (json.status && json.status != 200) {
                        setMeasureState({ isLoaded: true, error: json, errorCode: json.status ?? -1, measure: null })
                    } else {
                        //Otherwise asumed as correct (A valid server response doesn't return a 200, sadly)
                        setMeasureState({ isLoaded: true, error: null, errorCode: 0, measure: json })
                    }
                })
                .catch(error => {
                    console.log("Error", error)
                    setMeasureState({ isLoaded: true, error: error, errorCode: -1, measure: null })
                })
        }
    }

    function retryHandler() {
        setMeasureState({ isLoaded: false, error: false, errorCode: 0, measure: null })
    }

    const { isLoaded, error, errorCode, measure } = measureState;

    if (error) {
        return <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={"Aktuell kann die Maßnahme leider nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut." + " (Fehlercode: " + errorCode + ")"
     }></NoContentView>
    } else if (!isLoaded) {
        return <NoContentView icon="cloud-download" loading title="Die Evaluierung wird durchgeführt..."></NoContentView>
    } else {
        const head = '<html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body {font-size: 110%; font-family: Arial;} p{text-align: justify; hyphens: auto; }</style></head>'
        var content = measure?.description ?? "<p>Leider wurde noch kein detaillierter Inhalt hinterlegt.</>"

        if (measure?.resources) {
            measure.resources.forEach(r => {
                switch (r.mime) {
                    case "image/jpeg":
                    case "image/png":
                        const uri = "https://pas.coala.digital/v1/measures/" + measure.uuid + "/resource/" + r.name
                        content += "<img style=\"max-width: 100%\" src=\"" + uri + "\"/>" + "<p>Bild: " + r.description + "</>"
                }
            });
        }

        const wrapped = head + '<body>' + content + '</body></html>'

        props.navigation.setOptions({
            title: measure?.name ?? "Maßnahmeninformation"
        })

        return (
            <View style={styles.container}>
                <URLInterceptingWebview source={{ html: wrapped }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    }
});

export default EvaluationDetailScreen