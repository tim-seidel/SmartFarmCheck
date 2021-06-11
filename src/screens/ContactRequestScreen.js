import React, { useState, useCallback } from 'react'
import { Alert, KeyboardAvoidingView, StyleSheet, TextInput, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import { ScrollView } from 'react-native-gesture-handler'
import NetInfo from '@react-native-community/netinfo'

import RootView from '../components/common/RootView'
import InformationCard, { InformationLineBreak, InformationText } from '../components/common/InformationCard'
import { ContentText } from '../components/common/Text'
import IconButton from '../components/common/IconButton'
import Separator from '../components/common/Separator'
import NoContentView from '../components/common/NoContentView'

import { evaluationToContact, SET_EVALUATION_CONTACT_REQUEST } from '../store/actions/evaluation'
import Strings from '../constants/Strings'
import Layout from '../constants/Layout'
import Keys from '../constants/Keys'
import { darkTheme, lightTheme } from '../constants/Colors'

const ContactRequestScreen = (props) => {
    const { navigation, route } = props
    const { formUuid, answers } = route.params

    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)
    const [hasNoNetwork, setHasNoNetwork] = useState(false)
    const [errorCode, setErrorCode] = useState(0)

    const [email, setEmail] = useState("")
    const [emailValidity, setEmailValidity] = useState("empty")
    //const [privacyConsent, setPrivacyConsent] = useState(false)
    const contactRequest = useSelector(state => state.evaluation.contactRequest)

    const checkAndLoadContactRequest = useCallback(async () => {
        if (answers.length === 0) {
            Alert.alert(
                Strings.contact_request_dialog_empty_title,
                Strings.contact_request_dialog_empty_content,
                [
                    { text: Strings.okay, style: "cancel" },
                ]
            )
            return
        }

        if (emailValidity !== 'valid') return

        const netinfo = await NetInfo.fetch()
        if (netinfo.isConnected) {
            setIsLoading(true)
            try {
                await dispatch(evaluationToContact(formUuid, answers, email))
            } catch (err) {
                console.log(err)
                setErrorCode(err.name === "AbortError" ? 6000 : (err.status ?? -1))
            }
            setIsLoading(false)
        } else {
            setHasNoNetwork(true)
        }
    }, [dispatch, email, emailValidity])

    function retryHandler() {
        setErrorCode(0)
        setHasNoNetwork(false)
        checkAndLoadContactRequest()
    }

    function emailHandler(input) {
        const isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/.test(input)
        setEmail(input)
        setEmailValidity(input ? (isValid ? 'valid' : 'invalid') : 'empty')
    }

    function successHandler() {
        dispatch({
            type: SET_EVALUATION_CONTACT_REQUEST,
            contactRequest: undefined
        })
        navigation.goBack()
    }

    let contentView = null
    if (errorCode !== 0) {
        contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.contact_request_loading_error + " (Fehlercode: " + errorCode + ")"} />
    } else if (isLoading) {
        console.log("IsLoading...")
        contentView = <NoContentView icon="cloud-download" loading title={Strings.contact_request_loading} />
    } else if (hasNoNetwork && !contactRequest) {
        contentView = <NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.contact_request_loading_no_network} />
    } else if (contactRequest) {
        contentView = <NoContentView icon="check" onRetry={successHandler} retryTitle={Strings.back} title={Strings.contact_request_success} />
    }

    let emailText = "Bitte eine E-Mail eingeben"
    if (emailValidity === 'invalid') emailText = "Bitte eine gültige E-Mail eingeben."
    if (emailValidity === 'valid') emailText = "Die E-Mail ist gültig. Sie können absenden!"

    if (contentView) {
        return <RootView>
            {contentView}
        </RootView>
    }
    else {
        return (
            <RootView>
                <View style={styles.informationWrapper}>
                    <ScrollView style={styles.scroll}>
                        <InformationCard icon="numeric-1-circle-outline" style={styles.card} title="So funktioniert's:" toggleInformationEnabled toggleStoreKey={Keys.INFORMATION_TOGGLE_FORM_HELP_SCREEN} >
                            <InformationText>Sollten beim Beantworten des Fragebogens Fragen aufkommen oder die Ergebnisse der Bewertung unklar bleiben, zögern Sie nicht uns zu kontaktieren!</InformationText>
                            <InformationLineBreak breaks={2} />
                            <InformationText>Um den Austausch mit einem Mitarbeiter des Mittelstand 4.0 Kompetenzzentrums zu vereinfachen, wird zur Übersicht ein Dokument mit Ihren Antworten und den erhaltenen Bewertungen erstellt und an Sie und uns per Mail gesendet.</InformationText>
                        </InformationCard>
                        <InformationCard icon="numeric-2-circle-outline" style={styles.card} title="Wie ist das mit dem Datenschutz?" toggleInformationEnabled toggleStoreKey={Keys.INFORMATION_TOGGLE_FORM_HELP_SCREEN_PRIVACY}>
                            <InformationText>Die von Ihnen eingebenen Daten werden zur Auswertung und Generierung des Dokumentes an den Server gesendet, aber NICHT gespeichert; auch nicht die Mail-Adresse. Die Bewertungsdaten sind weiterhin zu jedem Zeitpunkt anonym. Sie werden hinterher lediglich an Ihre und unsere Kontakt-Mail versendet, damit wir mit Ihnen in Konkakt treten können. </InformationText>
                            <InformationLineBreak breaks={2} />
                            <InformationText>Möchten Sie dennoch einige Daten nicht preisgeben, können Sie die entsprechenden Fragen unausgefüllt lassen. Alternativ können Sie auch eine anonyme Mail-Adresse verwenden.</InformationText>
                        </InformationCard>
                    </ScrollView>
                </View>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset="64">
                    <View style={styles.emailWrapper}>
                        <Separator style={styles.separator} />
                        <ContentText
                            style={styles.emailStatus}
                            small
                            error={emailValidity === 'invalid'}
                            light={emailText !== 'invalid'}>
                            {emailText}
                        </ContentText>
                        <View style={styles.inputRow}>
                            <TextInput
                                textContentType="emailAddress"
                                keyboardType="email-address"
                                placeholder="kontakt@e.mail"
                                placeholderTextColor={colorTheme.textHint}
                                value={email}
                                onChangeText={emailHandler}
                                style={{
                                    ...styles.emailInput,
                                    color: colorTheme.textPrimary,
                                    backgroundColor: colorTheme.background,
                                    flex: 1
                                }} />
                            <IconButton
                                disabled={emailValidity !== 'valid'}
                                icon="email-send-outline"
                                text="Senden"
                                onPress={checkAndLoadContactRequest} />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </RootView>
        )
    }
}

const styles = StyleSheet.create({
    scroll: {
        marginHorizontal: 8
    },
    informationWrapper: {
        flex: 1
    },
    card: {
        marginTop: 8
    },
    contentWrapper: {
        margin: 8
    },
    separator: {
        marginVertical: 8
    },
    emailWrapper: {
        paddingHorizontal: 8,
        paddingVertical: 12,
        fontSize: 16
    },
    inputRow: {
        flexDirection: 'row',
        marginTop: 8
    },
    emailInput: {
        paddingHorizontal: 8,
        borderRadius: Layout.borderRadius,
        borderWidth: Layout.borderWidth,
        borderColor: Layout.borderColor,
        marginEnd: 8
    },

})

export default ContactRequestScreen
