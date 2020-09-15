import React, { useCallback, useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux'

import { useThemeProvider } from '../ThemeContext'
import InformationCard, { InformationText } from '../components/InformationCard'
import { Input, HeadingText, ContentText } from '../components/Text'
import IconButton from '../components/IconButton'
import NoContentView from '../components/NoContentView'
import Strings from '../constants/Strings'
import Keys from '../constants/Keys'
import RootView from '../components/RootView'
import { submitFeedback } from '../store/actions/feedback';

const FeedbackScreen = (props) => {
    const { colorTheme } = useThemeProvider()

    const [userInput, onUserInputChange] = React.useState('')
    const [userContact, onUserContactChange] = React.useState('')

    const [isLoading, setIsLoading] = useState(false)
    const [hasNoNetwork, setHasNoNetwork] = useState(false)
    const [errorCode, setErrorCode] = useState(0)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const dispatch = useDispatch()

    function sendFeedbackHandler() {
        if (userInput.length < 10) {
            Alert.alert(Strings.feedback_content_missing_input,
                Strings.feedback_content_mimimum_input_length_message,
                [{ text: Strings.okay, style: "cancel" }],
                { cancelable: true })
        } else {
            submitFeedbackInternal()
        }
    }

    const submitFeedbackInternal = useCallback(async () => {
        const netinfo = await NetInfo.fetch()
        if (netinfo.isConnected) {
            setIsLoading(true)
            try {
                await dispatch(submitFeedback({ contact: userContact, message: userInput }))
            } catch (err) {
                console.log(err)
                setErrorCode(err.status ?? -1)
            }
            setIsLoading(false)
            setIsSubmitted(true)
        } else {
            setHasNoNetwork(true)
        }
    }, [dispatch])

    function retryHandler() {
        setErrorCode(0)
        setHasNoNetwork(false)
        setIsSubmitted(false)
        submitFeedbackInternal()
    }

    function goBackHandler() {
        props.navigation.goBack()
    }

    var contentView = null
    if (errorCode !== 0) {
        contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.measure_loading_error + "(Fehlercode: " + errorCode + ")"} />
    } else if (isLoading) {
        contentView = <NoContentView title={Strings.feedback_sending} loading icon="cloud-download" />
    } else if (hasNoNetwork && !isSubmitted) {
        contentView = <NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.feedback_submitting_no_network} />
    } else if (isSubmitted) {
        contentView = (
            <>
                <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                    <Icon color={colorTheme.textPrimary} name="check" size={96}></Icon>
                    <HeadingText>{Strings.feedback_sending_competed}</HeadingText>
                    <ContentText align='center'>{userContact.length > 5 ? Strings.feedback_contact_soon : Strings.feedback_no_contact_soon}</ContentText>
                </View>
                <View style={styles.button}>
                    <IconButton icon="chevron-left" text={Strings.back} onPress={goBackHandler}></IconButton>
                </View>
            </>
        )
    } else {
        contentView = (
            <>
                <InformationCard toggleInformationEnabled toggleStoreKey={Keys.INFORMATION_TOGGLE_FEEDBACK_SCREEN} style={styles.card} title={Strings.feedback_information_title}>
                    <InformationText>{Strings.feedback_information_text}</InformationText>
                </InformationCard>
                <HeadingText style={styles.heading}>{Strings.feedback_contact_title}</HeadingText>
                <Input placeholder={Strings.feedback_contact_placeholder} autoCorrect={false} multiline numberOfLines={3} style={styles.contact} value={userContact} onChangeText={text => onUserContactChange(text)} />
                <HeadingText style={styles.heading}>{Strings.feedback_content_title}</HeadingText>
                <Input placeholder={Strings.feedback_content_placeholder} multiline style={styles.feedback} value={userInput} onChangeText={text => onUserInputChange(text)} />
                <View style={styles.button}>
                    <IconButton icon="chart-areaspline" text={Strings.feedback_submit} onPress={sendFeedbackHandler} />
                </View>
            </>
        )
    }

    return (
        <RootView>
            {contentView}
        </RootView>
    )
}

const styles = StyleSheet.create({
    card: {
        margin: 8
    },
    heading: {
        marginStart: 10,
        marginBottom: 4
    },
    feedback: {
        flex: 1,
        marginHorizontal: 8
    },
    contact: {
        marginHorizontal: 8,
        marginBottom: 8
    },
    button: {
        margin: 8
    }
})

export default FeedbackScreen
