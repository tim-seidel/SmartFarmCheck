import React from 'react'
import { View, StyleSheet, Linking } from 'react-native'

import InformationCard, { InformationHighlight, InformationText } from '../components/InformationCard';
import Strings from '../constants/Strings';
import IconButton from '../components/IconButton';
import { ScrollView } from 'react-native-gesture-handler';

const ContactScreen = (props) => {

    const contactMailHandler = () => {
        Linking.openURL("mailto:mittelstand40@hs-osnabrueck.de")
    }

    const contactPhoneHandler = () => {
        Linking.openURL("tel:05419690000")
    }

    const contactFeedbackHandler = () => {
        props.navigation.navigate('Feedback')
    }

    const contentMail = <View style={styles.action}><IconButton icon="email-outline" text="Jetzt E-Mail verfassen" onPress={contactMailHandler}></IconButton></View>
    const contentPhone = <View style={styles.action}><IconButton icon="phone" text="Jetzt anrufen" onPress={contactPhoneHandler}></IconButton></View>
    const contentFeedback = <View style={styles.action}><IconButton icon="file-document-outline" text="Zum Feedback" onPress={contactFeedbackHandler}></IconButton></View>
    return (
        <ScrollView style={styles.container}>
            <InformationCard title="Per Mail" style={styles.welcomeCard} contentView={contentMail}>
                <InformationText>{"Bei allgemeinen Fragen können Sie uns jederzeit per Mail erreichen. Wir werden uns dann entsprechend bei Ihnen zurückmelden.\n\n"}</InformationText>
                <InformationHighlight>{Strings.mail + "\n"}</InformationHighlight>
            </InformationCard>
            <InformationCard title="Telefonisch" style={styles.welcomeCard} contentView={contentPhone}>
                <InformationText>{"Natürlich können Sie uns auch telefonisch zu den normalen Bürozeiten erreichen.\n\n"}</InformationText>
                <InformationHighlight>{"Andreas Ansprechpartner\nTel: 0541-969-1234\n"}</InformationHighlight>
            </InformationCard>
            <InformationCard title="App-Feedback" style={styles.welcomeCard} contentView={contentFeedback}>
                <InformationText>{"Bei Fragen zur App oder Problemen können Sie auch hier ein Formular ausfüllen.\n"}</InformationText>
            </InformationCard>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    welcomeCard: {
        margin: 8
    },
    action: {
        marginHorizontal: 8
    }
})

export default ContactScreen;
