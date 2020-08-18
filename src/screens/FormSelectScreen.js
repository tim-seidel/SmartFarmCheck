import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import NetInfo from '@react-native-community/netinfo'

import { useThemeProvider } from '../ThemeContext'
import InformationCard, { InformationText } from '../components/InformationCard'
import FormSelectListItemView from '../components/FormSelectListItemView'
import Strings from '../constants/Strings'
import NoContentView from '../components/NoContentView'
import { HeadingText } from '../components/Text'
import { FlatList } from 'react-native-gesture-handler'
import Keys from '../constants/Keys'

const formsMock = [
    {
        uuid: '1',
        title: 'Ackerbau',
        description: 'Dieses Formular legt den Schwerpunkt auf Fragen zu Betrieben, die primär dem Ackerbau zugeordnet sind.'
    },
    {
        uuid: '2',
        title: 'Viehzucht',
        description: 'Dieses Formular legt den Schwerpunkt auf Fragen zu Betrieben, die primär der Zucht von Tieren zugeordnet sind.'
    },
    {
        uuid: '3',
        title: 'Forstwirtschaft',
        description: 'Dieses Formular legt den Schwerpunkt auf Fragen zu Betrieben, die primär der Forstwirtschaft zugeordnet sind.'
    }
]

const FormSelectScreen = (props) => {
    const [formsState, setFormsState] = useState({ isLoaded: false, hasNetwork: true, error: null, errorCode: 0, forms: [] })

    const { colorTheme } = useThemeProvider()

    useEffect(() => {
        if (!formsState.isLoaded) {
            checkAndLoadForms()
        }
    }, [formsState.isLoaded])

    function checkAndLoadForms() {
        if (!formsState.isLoaded) {

            NetInfo.fetch().then(state => {
                if (state.isConnected) {
                    loadForms()
                } else {
                    setFormsState({ isLoaded: true, error: null, errorCode: 0, hasNetwork: false, forms: [] })
                }
            })
        }
    }

    function loadForms() {
        /*
        fetch('https://pas.coala.digital/v1/forms', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
        })
            .then(response => response.json())
            .then(json => {
                //Check for request errors
                if (json.status && json.status != 200) {
                    setFormsState({ isLoaded: true, hasNetowrk: true, error: json, errorCode: json.status ?? -1, forms: [] })
                } else {
                    //Otherwise asumed as correct (A valid server response doesn't return a 200, sadly)
                    json.sort(function (l, r) {
                        if (l.name < r.name) return -1
                        else if (l.name > r.name) return 1
                        else return 0
                    })
                    setFormsState({ isLoaded: true, hasNetwork: true, error: null, errorCode: 0, forms: json })
                }

            })
            .catch(error => {
                console.log("Error", error)
                setFormsState({ isLoaded: true, hasNetowrk: true, error: error, errorCode: -1, forms: [] })
            })
            */
        setFormsState({ isLoaded: true, hasNetwork: true, error: null, errorCode: 0, forms: formsMock })
    }

    function retryHandler() {
        setFormsState({ isLoaded: false, error: false, errorCode: 0, forms: [] })
    }

    function formSelectedHandler(formUuid) {
        props.navigation.navigate('Form', formUuid)
    }

    const { error, errorCode, hasNetwork, isLoaded, forms } = formsState

    if (error) {
        return <View style={{ ...styles.container, backgroundColor: colorTheme.background }}><NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.select_form_loading_error + "(Fehlercode: " + errorCode + ")"}></NoContentView></View>
    } else if (!isLoaded) {
        return <View style={{ ...styles.container, backgroundColor: colorTheme.background }}><NoContentView icon="cloud-download" loading title={Strings.select_form_loading}></NoContentView></View>
    } else if (!hasNetwork) {
        return <View style={{ ...styles.container, backgroundColor: colorTheme.background }}><NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.select_form_loading_no_network}></NoContentView></View>
    } else if (forms.length === 0) {
        return <View style={{ ...styles.container, backgroundColor: colorTheme.background }}><NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.select_form_loading_empty}></NoContentView></View>
    } else {

        const informationHeader =
            <View>
                <InformationCard toggleInformationEnabled toggleStoreKey={Keys.INFORMATION_TOGGLE_FORM_SELECT_SCREEN} style={styles.card} title={Strings.select_form_information_title}>
                    <InformationText>{Strings.select_form_information_text}</InformationText>
                </InformationCard>
                <HeadingText large weight="bold" style={styles.heading}>Verfübare Fragebögen:</HeadingText>
            </View>

        return (
            <View style={{ ...styles.container, backgroundColor: colorTheme.background }}>
                <FlatList
                    style={styles.list}
                    data={forms}
                    ListHeaderComponent={informationHeader}
                    renderItem={({ item }) => (
                        <FormSelectListItemView
                            key={item.uuid}
                            title={item.title}
                            description={item.description}
                            onSelected={() => formSelectedHandler(item.uuid)}
                        />
                    )}
                    keyExtractor={item => item.uuid}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    card: {
        marginTop: 8
    },
    heading: {
        marginTop: 16,
        marginBottom: 8,
        marginStart: 2
    },
    list: {
        marginHorizontal: 8
    }
})

export default FormSelectScreen
