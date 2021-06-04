import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Linking, Dimensions } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import RootView from '../components/common/RootView'
import InformationCard, { InformationHighlight, InformationLineBreak, InformationText } from '../components/common/InformationCard'
import  { WrappedIconButton } from '../components/common/IconButton'

import Strings from '../constants/Strings'
import { ABOUTSCREEN } from '../constants/Paths'

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
        Linking.openURL("mailto:" + Strings.mail)
    }

    const contactPhoneHandler = () => {
        Linking.openURL("tel:" + Strings.phone)
    }

    const aboutAppHandler = () => {
        props.navigation.navigate(ABOUTSCREEN)
    }
    const contentMail = <WrappedIconButton style={styles.button} icon="email-outline" text={Strings.contact_mail_action} onPress={contactMailHandler} />
    const contentPhone = <WrappedIconButton style={styles.button} icon="phone" text={Strings.contact_phone_action} onPress={contactPhoneHandler} />
    const contentAboutApp = <WrappedIconButton style={styles.button} icon="information-outline" text={Strings.contact_information_action } onPress={aboutAppHandler} />
    const cardStyle = orientation === 'portrait' ? styles.contactCardSingle : styles.contactCardGrid
    return (
        <RootView>
            <ScrollView>
                <View style={styles.contactGrid}>
                    <View style={cardStyle}>
                        <InformationCard style={styles.equalHeightInRow} title={Strings.contact_mail_title} contentView={contentMail}>
                            <InformationText>{Strings.contact_mail_description}</InformationText>
                            <InformationLineBreak breaks={2}/>
                            <InformationHighlight>{Strings.mail}</InformationHighlight>
                            <InformationLineBreak breaks={1}/>
                        </InformationCard>
                    </View>
                    <View style={cardStyle}>
                        <InformationCard style={styles.equalHeightInRow} title={Strings.contact_phone_title} contentView={contentPhone}>
                            <InformationText>{Strings.contact_phone_description}</InformationText>
                            <InformationLineBreak breaks={2}/>
                            <InformationHighlight>{Strings.contact_mail_contact}</InformationHighlight>
                            <InformationLineBreak breaks={1}/>
                        </InformationCard>
                    </View>
                    <View style={styles.contactCardSingle}>
                        <InformationCard style={styles.equalHeightInRow} title={Strings.contact_information_title} contentView={contentAboutApp}>
                            <InformationText>{Strings.contact_information_description}</InformationText>
                            <InformationLineBreak breaks={2}/>
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
    equalHeightInRow: {
        flex: 1
    },
    buttonRow: {
        flexDirection: 'row',
    },
    buttonInRow: {
        margin: 4,
        flex: 1
    },
    button: {
        marginBottom: 8,
        marginHorizontal: 8
    }
})

export default ContactScreen
