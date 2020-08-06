import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import NoContentView from '../components/NoContentView';
import URLInterceptingWebview from '../components/URLInterceptingWebview';
import { useStateValue } from '../StateProvider';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import SFCHeaderButton from '../navigation/SFCHeaderButton';

const EvaluationDetailScreen = (props) => {
    const [{ colorTheme }, dispatch] = useStateValue()
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
        return <View style={{ ...styles.container, backgroundColor: colorTheme.background }}><NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={"Aktuell kann die Maßnahme leider nicht geladen werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut." + " (Fehlercode: " + errorCode + ")"
        }></NoContentView></View>
    } else if (!isLoaded) {
        return <View style={{ ...styles.container, backgroundColor: colorTheme.background }}><NoContentView icon="cloud-download" loading title="Die Evaluierung wird durchgeführt..."></NoContentView></View>
    } else {
        const head = '<html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body {font-size: 110%; font-family: Arial; color:  ' + colorTheme.textPrimary + '} p{text-align: justify; hyphens: auto; }</style></head>'
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
            title: measure?.name ?? "Maßnahmeninformation",
            headerRight: () => (
              <HeaderButtons HeaderButtonComponent={SFCHeaderButton}>
                <Item key="option-darkmode" iconName="brightness-6" title={"Dunkelmodus toggeln"} onPress={() => dispatch({ type: 'toggleTheme' })} />
              </HeaderButtons>
            )
          })

        return (
            <View style={{ ...styles.container, backgroundColor: colorTheme.background }}>
                <URLInterceptingWebview style={{backgroundColor: colorTheme.background}} source={{ html: wrapped }} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default EvaluationDetailScreen