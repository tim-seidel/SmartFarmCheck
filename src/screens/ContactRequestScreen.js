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
        contentView = <NoContentView icon="cloud-download" loading title={Strings.contact_request_loading} />
    } else if (hasNoNetwork && !contactRequest) {
        contentView = <NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.contact_request_loading_no_network} />
    } else if (contactRequest) {
        contentView = <NoContentView icon="check" onRetry={successHandler} retryTitle={Strings.back} title={Strings.contact_request_success} />
    }

    let emailText = Strings.contact_request_please_enter_mail
    if (emailValidity === 'invalid') emailText = Strings.contact_request_please_enter_valid_mail
    if (emailValidity === 'valid') emailText = Strings.contact_request_mail_is_valid

    if (contentView) {
        return <RootView>
            {contentView}
        </RootView>
    }
    else {
        return (
            <RootView thin>
                <View style={styles.informationWrapper}>
                    <ScrollView style={styles.scroll}>
                        <InformationCard
                            style={styles.card}
                            icon="numeric-1-circle-outline"
                            title={Strings.contact_request_how_it_works_title}
                            toggleInformationEnabled
                            toggleStoreKey={Keys.INFORMATION_TOGGLE_FORM_HELP_SCREEN} >
                            <InformationText>{Strings.contact_request_how_it_works_content_questions}</InformationText>
                            <InformationLineBreak breaks={2} />
                            <InformationText>{Strings.contact_request_how_it_works_content_document}</InformationText>
                        </InformationCard>
                        <InformationCard
                            style={styles.card}
                            icon="numeric-2-circle-outline"
                            title={Strings.contact_request_about_privacy_title}
                            toggleInformationEnabled
                            toggleStoreKey={Keys.INFORMATION_TOGGLE_FORM_HELP_SCREEN_PRIVACY}>
                            <InformationText>{Strings.contact_request_about_privacy_content_document}</InformationText>
                            <InformationLineBreak breaks={2} />
                            <InformationText>{Strings.contact_request_about_privacy_content_advices}</InformationText>
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
                                placeholder={Strings.contact_request_mail_placeholder}
                                placeholderTextColor={colorTheme.textHint}
                                value={email}
                                onChangeText={emailHandler}
                                style={{
                                    ...styles.emailInput,
                                    color: colorTheme.textPrimary,
                                    backgroundColor: colorTheme.background,
                                }} />
                            <IconButton
                                disabled={emailValidity !== 'valid'}
                                icon="email-send-outline"
                                text={Strings.send}
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
        flex: 1,
        paddingHorizontal: 8,
        borderRadius: Layout.borderRadius,
        borderWidth: Layout.borderWidth,
        borderColor: Layout.borderColor,
        marginEnd: 8
    },
})

export default ContactRequestScreen
