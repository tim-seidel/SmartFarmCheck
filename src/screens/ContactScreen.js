import React from 'react';
import { View, StyleSheet, Linking, Platform, } from 'react-native'

import InformationCard, { InformationHighlight, InformationText } from '../components/InformationCard';
import Strings from '../constants/Strings';
import IconButton from '../components/IconButton';
import { ScrollView } from 'react-native-gesture-handler';

const ActionButton = (props) => {
    return (<View style={styles.action}>
        <IconButton type={Platform.OS === 'ios' ? 'light' : 'outline'} icon={props.icon} text={props.text} onPress={props.onPress}></IconButton>
    </View>)
}

const ContactScreen = (props) => {

    const contactMailHandler = () => {
        Linking.openURL("mailto:mittelstand40@hs-osnabrueck.de")
    }

    const contactPhoneHandler = () => {
        Linking.openURL("tel:05419691234")
    }

    const contactFeedbackHandler = () => {
        props.navigation.navigate('Feedback')
    }

    const aboutAppHandler = () => {
        console.log('Über diese App!')
        props.navigation.navigate('About')
    }
    const contentAboutApp = <ActionButton icon="information-outline" text="Über diese App" onPress={aboutAppHandler}/>
    const contentMail = <ActionButton icon="email-outline" text="Jetzt E-Mail verfassen" onPress={contactMailHandler}/>
    const contentPhone = <ActionButton icon="phone" text="Jetzt anrufen" onPress={contactPhoneHandler}/>
    const contentFeedback = <ActionButton icon="file-document-outline" text="Zum Feedback" onPress={contactFeedbackHandler}/>
     return (
        <View style={styles.container}>
            <ScrollView >
                <InformationCard title="Über diese App" style={styles.welcomeCard} contentView={contentAboutApp}>
                    <InformationText>{"Informationen über Förderer, Impressum und Datenschutz.\n"}</InformationText>
                </InformationCard>
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
        </View>
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
    },
    buttonRow: {
        flexDirection: 'row',
    },
    buttonInRow: {
        margin: 4,
        flex: 1
    }
})

export default ContactScreen;
