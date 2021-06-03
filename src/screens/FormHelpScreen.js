import React, { useState, useCallback } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import NetInfo from '@react-native-community/netinfo'

import RootView from '../components/common/RootView'
import { ScrollView } from 'react-native-gesture-handler'
import InformationCard, { InformationLineBreak, InformationText } from '../components/common/InformationCard'
import IconButton from '../components/common/IconButton'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import { darkTheme, lightTheme } from '../constants/Colors'
import Keys from '../constants/Keys'
import Layout from '../constants/Layout'
import { evaluationToContact } from '../store/actions/evaluation'
import { ContentText } from '../components/common/Text'
import Separator from '../components/common/Separator'
import Strings from '../constants/Strings'
import NoContentView from '../components/common/NoContentView'

function isEmailValid(mail) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    return reg.test(mail)
}

const FormHelpScreen = (props) => {
    const { navigation, route } = props
    const { formUuid, answers } = route.params

    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(false)
    const [hasNoNetwork, setHasNoNetwork] = useState(false)
    const [errorCode, setErrorCode] = useState(0)

    const [email, setEmail] = useState("")
    const [isSend, setIsSend] = useState(false)
    //const [privacyConsent, setPrivacyConsent] = useState(false)
    const contactRequest = useSelector(state => state.evaluation.contactRequest)

    const checkAndLoadContactRequest = useCallback(async () => {
        if (!isEmailValid(email)) {console.log("Invalid email: ", email); return }

        const netinfo = await NetInfo.fetch()
        if (netinfo.isConnected) {
            setIsLoading(true)
            setIsSend(true)
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

    function successHandler(){
        navigation.goBack()
    }

    function onEmailChange(mail) {
        setEmail(mail)
    }

    let contentView = null
    if (errorCode !== 0 || (contactRequest && contactRequest.status !== 200)) {
        contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.contact_request_loading_error + " (Fehlercode: " + errorCode + ")"} />
    } else if (isLoading) {
        contentView = <NoContentView icon="cloud-download" loading title={Strings.contact_request_loading} />
    } else if (hasNoNetwork && !contactRequest) {
        contentView = <NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.contact_request_loading_no_network} />
    } else if (contactRequest && isSend && contactRequest.status === 200) {
        contentView = <NoContentView icon="check" onRetry={successHandler} retryTitle={Strings.back} title={Strings.contact_request_success} />
    }

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
                            <InformationText>Möchten Sie dennoch einige Daten nicht preisgeben, können Sie die entsprechenden Fragen unausgefüllt lassen. Alternativ können Sie auch eine annoyme Mail-Adresse verwenden.</InformationText>
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
                        <TextInput
                            style={styles.email}
                            placeholder="kontakt@e.mail"
                            placeholderTextColor={colorTheme.textHint}
                            value={email}
                            onChangeText={(value) => setEmail(value)}
                            style={{
                                ...styles.email,
                                color: colorTheme.textPrimary,
                                backgroundColor: colorTheme.background
                            }} />
                    </View>
                    <View style={styles.sendButtonWrapper}>
                        <IconButton icon="send" text="Jetzt Kontakt aufnehmen!" onPress={checkAndLoadContactRequest} />
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
        marginHorizontal: 8,
    },
    row: {
        flexDirection: 'row',
        borderRadius: Layout.borderRadius,
        borderWidth: Layout.borderWidth,
        borderColor: Layout.borderColor,
    },
    fieldname: {
        justifyContent: 'center',
        marginStart: 8
    },
    email: {
        flex: 1,
        paddingEnd: 8,
        paddingVertical: 8,
        fontSize: 16,
    }
})

export default FormHelpScreen
