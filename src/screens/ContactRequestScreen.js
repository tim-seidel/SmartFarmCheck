import React, { useState, useCallback } from 'react'
import { Alert, StyleSheet, TextInput, View } from 'react-native'
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
    const [emailValidity, setEmailValidity] = useState("valid")
    //const [privacyConsent, setPrivacyConsent] = useState(false)
    const contactRequest = useSelector(state => state.evaluation.contactRequest)

    const checkAndLoadContactRequest = useCallback(async () => {
        console.log(answers)
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
    }, [dispatch])

    function retryHandler() {
        setErrorCode(0)
        setHasNoNetwork(false)
        checkAndLoadContactRequest()
    }

    function emailHandler(mail) {
        mail = mail.trim()
        const isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/.test(mail)
        setEmail(mail)
        setEmailValidity(mail ? (isValid ? 'valid' : 'invalid') : 'empty')
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
        contentView = <NoContentView icon="cloud-download" loading title={Strings.contact_request_loading} />
    } else if (hasNoNetwork && !contactRequest) {
        contentView = <NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.contact_request_loading_no_network} />
    } else if (contactRequest) {
        contentView = <NoContentView icon="check" onRetry={successHandler} retryTitle={Strings.back} title={Strings.contact_request_success} />
    }

    const emailText = emailValidity === 'empty' ? "Bitte eine E-Mail eingeben." : (emailValidity === 'invalid' ? "Bitte eine gültige E-Mail eingeben." : "")

    if (contentView) {
        return <RootView>
            {contentView}
        </RootView>
    }
    else {
        return (
            <RootView style={{ flex: 1, flexDirection: 'column' }}>
                <View style={{ flex: 1 }}>
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

                <View style={styles.contentWrapper}>
                    <Separator style={styles.actionsSeperator} />
                    <View style={styles.row}>
                        <View style={styles.fieldname}>
                            <ContentText large>E-Mail</ContentText>
                        </View>
                        <Separator orientation="vertical" style={styles.inputSeperator} />
                        <View style={styles.inputColumn}>
                            {emailValidity !== 'valid' && <ContentText style={styles.emailStatus} small error={emailValidity === 'invalie'}>{emailText}</ContentText>}
                            {emailValidity !== 'valid' && <Separator />}
                            <TextInput
                                style={styles.email}
                                placeholder="kontakt@e.mail"
                                placeholderTextColor={colorTheme.textHint}
                                value={email}
                                onChangeText={emailHandler}
                                style={{
                                    ...styles.email,
                                    color: colorTheme.textPrimary,
                                    backgroundColor: colorTheme.background
                                }} />
                        </View>
                    </View>

                    <View style={styles.sendButtonWrapper}>
                        <IconButton disabled={emailValidity !== 'valid'} icon="send" text="Jetzt Kontakt aufnehmen!" onPress={checkAndLoadContactRequest} />
                    </View>
                </View>
            </RootView>
        )
    }
}

const styles = StyleSheet.create({
    scroll: {
        marginHorizontal: 8,
    },
    card: {
        marginTop: 8
    },
    contentWrapper: {
        margin: 8,
    },
    sendButtonWrapper: {
        marginTop: 8
    },
    actionsSeperator: {
        marginVertical: 8,
    },
    inputSeperator: {
        marginStart: 8,
    },
    row: {
        flexDirection: 'row',
        borderRadius: Layout.borderRadius,
        borderWidth: Layout.borderWidth,
        borderColor: Layout.borderColor,
    },
    inputColumn: {
        flex: 1,
        flexDirection: 'column'
    },
    fieldname: {
        justifyContent: 'center',
        marginStart: 8
    },
    emailStatus: {
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    email: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        fontSize: 16,
    }
})

export default ContactRequestScreen
