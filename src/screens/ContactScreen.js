import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Linking, Platform, Dimensions } from 'react-native'

import InformationCard, { InformationHighlight, InformationText } from '../components/InformationCard'
import Strings from '../constants/Strings'
import IconButton from '../components/IconButton'
import { ScrollView } from 'react-native-gesture-handler'
import RootView from '../components/RootView'
import { ABOUTSCREEN } from '../constants/Paths'

const ActionButton = (props) => {
    return (<View style={styles.action}>
        <IconButton type={Platform.OS === 'ios' ? 'light' : 'solid'} icon={props.icon} text={props.text} onPress={props.onPress}></IconButton>
    </View>)
}

const isPortrait = () => {
    const dim = Dimensions.get('screen')
    return dim.height >= dim.width
}

const ContactScreen = (props) => {
    const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape')

    useEffect(() => {
        const callback = () => setOrientation(isPortrait() ? 'portrait' : 'landscape')

        Dimensions.addEventListener('change', callback)

        return () => {
            Dimensions.removeEventListener('change', callback)
        }
    }, [])

    const contactMailHandler = () => {
        Linking.openURL("mailto:mittelstand40@hs-osnabrueck.de")
    }

    const contactPhoneHandler = () => {
        Linking.openURL("tel:05419691234")
    }

    const aboutAppHandler = () => {
        props.navigation.navigate(ABOUTSCREEN)
    }
    const contentAboutApp = <ActionButton icon="information-outline" text="Über diese App" onPress={aboutAppHandler} />
    const contentMail = <ActionButton icon="email-outline" text="Jetzt E-Mail verfassen" onPress={contactMailHandler} />
    const contentPhone = <ActionButton icon="phone" text="Jetzt anrufen" onPress={contactPhoneHandler} />
    const cardStyle = orientation === 'portrait' ? styles.contactCardSingle : styles.contactCardGrid
    return (
        <RootView>
            <ScrollView>
                <View style={styles.contactGrid}>
                    <View style={cardStyle}>
                        <InformationCard style={styles.equalHeightInRow} title="Per Mail" contentView={contentMail}>
                            <InformationText>{"Bei allgemeinen Fragen können Sie uns jederzeit per Mail erreichen. Wir werden uns dann entsprechend bei Ihnen zurückmelden.\n\n"}</InformationText>
                            <InformationHighlight>{Strings.mail + "\n"}</InformationHighlight>
                        </InformationCard>
                    </View>
                    <View style={cardStyle}>
                        <InformationCard style={styles.equalHeightInRow} title="Telefonisch" contentView={contentPhone}>
                            <InformationText>{"Natürlich können Sie uns auch telefonisch zu den normalen Bürozeiten erreichen.\n\n"}</InformationText>
                            <InformationHighlight>{"Nikolas Neddermann\nTel: 0541-969-5017\n"}</InformationHighlight>
                        </InformationCard>
                    </View>
                    <View style={cardStyle}>
                        <InformationCard style={styles.equalHeightInRow} title="Informationen zur App"  contentView={contentAboutApp}>
                            <InformationText>{"Informationen über Förderer, Impressum und Datenschutz.\n"}</InformationText>
                        </InformationCard>
                    </View>        
                </View>
            </ScrollView>
            </RootView>
    )
}

const styles = StyleSheet.create({
    contactGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        padding: 4,
    },
    contactCardSingle: {
        padding: 4,
        width: '100%'
    },
    contactCardGrid: {
        width: '50%',
        paddingHorizontal: 4,
        paddingVertical: 4,
    },
    equalHeightInRow:{
        flex: 1
    },
    action: {
        marginHorizontal: 8,
        marginBottom: 8,
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

export default ContactScreen
