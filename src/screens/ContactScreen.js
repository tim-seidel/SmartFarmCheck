import React, {useState, useEffect} from 'react';
import { View, StyleSheet, Linking, Platform, Dimensions} from 'react-native'

import InformationCard, { InformationHighlight, InformationText } from '../components/InformationCard';
import Strings from '../constants/Strings';
import IconButton from '../components/IconButton';
import { ScrollView } from 'react-native-gesture-handler';

const ActionButton = (props) => {
    return (<View style={styles.action}>
        <IconButton type={Platform.OS === 'ios' ? 'light' : 'outline'} icon={props.icon} text={props.text} onPress={props.onPress}></IconButton>
    </View>)
}

const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
};

const ContactScreen = (props) => {
    const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape')

    useEffect(() => {
        const callback = () => setOrientation(isPortrait() ? 'portrait' : 'landscape');

        Dimensions.addEventListener('change', callback);

        return () => {
            Dimensions.removeEventListener('change', callback);
        };
    }, []);

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
        props.navigation.navigate('About')
    }
    const contentAboutApp = <ActionButton icon="information-outline" text="Über diese App" onPress={aboutAppHandler} />
    const contentMail = <ActionButton icon="email-outline" text="Jetzt E-Mail verfassen" onPress={contactMailHandler} />
    const contentPhone = <ActionButton icon="phone" text="Jetzt anrufen" onPress={contactPhoneHandler} />
    const contentFeedback = <ActionButton icon="file-document-outline" text="Zum Feedback" onPress={contactFeedbackHandler} />
    const cardStyle = orientation === 'portrait' ? styles.contactCardSingle : styles.contactCardGrid
    return (

        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <InformationCard title="Informationen zur App" style={cardStyle} contentView={contentAboutApp}>
                    <InformationText>{"Informationen über Förderer, Impressum und Datenschutz.\n"}</InformationText>
                </InformationCard>
                <InformationCard title="Per Mail" style={cardStyle} contentView={contentMail}>
                    <InformationText>{"Bei allgemeinen Fragen können Sie uns jederzeit per Mail erreichen. Wir werden uns dann entsprechend bei Ihnen zurückmelden.\n\n"}</InformationText>
                    <InformationHighlight>{Strings.mail + "\n"}</InformationHighlight>
                </InformationCard>
                <InformationCard title="Telefonisch" style={cardStyle} contentView={contentPhone}>
                    <InformationText>{"Natürlich können Sie uns auch telefonisch zu den normalen Bürozeiten erreichen.\n\n"}</InformationText>
                    <InformationHighlight>{"Andreas Ansprechpartner\nTel: 0541-969-1234\n"}</InformationHighlight>
                </InformationCard>
                <InformationCard title="App-Feedback" style={cardStyle} contentView={contentFeedback}>
                    <InformationText>{"Bei Fragen zur App oder Problemen können Sie auch hier ein Formular ausfüllen.\n"}</InformationText>
                </InformationCard>
            </View>
        </ScrollView>

    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
        justifyContent: 'space-evenly'
    },
    contactCardSingle: {
        marginVertical: 8,
        width: '90%'
    },
    contactCardGrid: {
        marginVertical: 8,
        width: '45%'
    },
    action: {
        marginHorizontal: 8,
        justifyContent: 'flex-end',
         flex: 1
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
