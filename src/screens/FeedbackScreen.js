import React from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { useThemeProvider } from '../ThemeContext'
import InformationCard, { InformationText } from '../components/InformationCard'
import { Input, HeadingText, ContentText } from '../components/Text'
import IconButton from '../components/IconButton'
import NoContentView from '../components/NoContentView'
import Strings from '../constants/Strings'

const FeedbackScreen = (props) => {
    const [userInput, onUserInputChange] = React.useState('')
    const [userContact, onUserContactChange] = React.useState('')
    const { colorTheme } = useThemeProvider()
    const [submitState, setSubmitState] = React.useState({ isLoading: false, isSubmitted: false })

    function sendFeedbackHandler() {
        if (userInput.length < 10) {
            Alert.alert("Fehlender Input",
                "Ein paar Zeichen lang sollte die Nachricht schon sein (mindestens 10) :)",
                { text: Strings.okay, style: "cancel" },
                { cancelable: true })
        } else {
            setSubmitState({ isLoading: true, isSubmitted: false })
        }
    }

    function goBackHandler() {
        props.navigation.goBack()
    }

    var content = null
    if (!submitState.isLoading && !submitState.isSubmitted) {
        content = (
            <>
                <InformationCard style={styles.card} title="Feedback/Hilfe zur App">
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
        content = <NoContentView title="Anfrage wird versendet..." loading icon="cloud-download" />
        setSubmitState({ isLoading: false, isSubmitted: true })
    } else if (submitState.isSubmitted) {
        content = (
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
        <View style={{ ...styles.container, backgroundColor: colorTheme.background }}>
            {content}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
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
