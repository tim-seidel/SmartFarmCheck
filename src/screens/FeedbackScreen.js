import React from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useThemeProvider } from '../ThemeContext'
import InformationCard, { InformationText } from '../components/InformationCard'
import { Input, HeadingText, ContentText } from '../components/Text'
import IconButton from '../components/IconButton'
import NoContentView from '../components/NoContentView'
import Strings from '../constants/Strings'
import Keys from '../constants/Keys'
import RootView from '../components/RootView'

const FeedbackScreen = (props) => {
    const [userInput, onUserInputChange] = React.useState('')
    const [userContact, onUserContactChange] = React.useState('')
    const [submitState, setSubmitState] = React.useState({ isLoading: false, isSubmitted: false })
    const { colorTheme } = useThemeProvider()

    function sendFeedbackHandler() {
        if (userInput.length < 10) {
            Alert.alert("Fehlender Input",
                "Die Nachricht sollte mindestens 10 Zeichen lang sein.",
                [{ text: Strings.okay, style: "cancel" }],
                { cancelable: true })
        } else {
            setSubmitState({ isLoading: true, isSubmitted: false })
        }
    }

    function goBackHandler() {
        props.navigation.goBack()
    }

    var contentView = null
    if (!submitState.isLoading && !submitState.isSubmitted) {
        contentView = (
            <>
                <InformationCard toggleInformationEnabled toggleStoreKey={Keys.INFORMATION_TOGGLE_FEEDBACK_SCREEN} style={styles.card} title="Feedback/Hilfe zur App">
                    <InformationText>Falls Sie eine Fragen oder Probleme mit der App haben, oder Feedback geben möchten, können Sie dieses Formular verwenden. Geben Sie gerne auch Kontaktdaten an, damit wir uns bei Ihnen zurückmelden können.</InformationText>
                </InformationCard>
                <HeadingText style={styles.heading}>Wie können wir Sie erreichen? (optional)</HeadingText>
                <Input placeholder="z.B. Name, Mail, Telefon, ..." multiline numberOfLines={3} style={styles.contact} value={userContact} onChangeText={text => onUserContactChange(text)} />
                <HeadingText style={styles.heading}>Was möchten Sie uns mitteilen?</HeadingText>
                <Input placeholder="Ihr Anliegen..." multiline style={styles.feedback} value={userInput} onChangeText={text => onUserInputChange(text)} />
                <View style={styles.button}>
                    <IconButton icon="chart-areaspline" text={"Absenden"} onPress={sendFeedbackHandler} />
                </View>
            </>
        )
    } else if (submitState.isLoading) {
        contentView = <NoContentView title="Anfrage wird versendet..." loading icon="cloud-download" />
        setSubmitState({ isLoading: false, isSubmitted: true })
    } else if (submitState.isSubmitted) {
        contentView = (
            <>
                <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                    <Icon color={colorTheme.textPrimary} name="check" size={96}></Icon>
                    <HeadingText>Erfolgreich versendet.</HeadingText>
                    {userContact.length > 5 && <ContentText align='center'>Wir werden uns nach Möglichkeit möglichst bald bei Ihnen melden.</ContentText>}
                </View>
                <View style={styles.button}>
                    <IconButton icon="chevron-left" text="Zurück" onPress={goBackHandler}></IconButton>
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
