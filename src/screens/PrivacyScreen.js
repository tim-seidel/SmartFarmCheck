import React from 'react'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { ContentText, HeadingText } from '../components/Text'
import RootView from '../components/RootView'

const PrivacyScreen = (props) => {
    return (
        <RootView>
            <ScrollView style={styles.scrollView}>
                <HeadingText style={styles.heading} weight="bold">Letzte Änderung: 08. November 2019</HeadingText>
                <ContentText>Im Folgenden erläutern wir, welche Informatione während der Nutztun der Applikation erfasst und verarbeitet werden.</ContentText>
                <HeadingText style={styles.heading} large weight="bold">Personenenbezogenen Daten</HeadingText>
                <ContentText>Diese Applikation sammelt keine personenbezogenen Daten. Eingaben des Nutzers werden nur lokal auf dem Gerät zur benutzerfreundlichen Bedienung gespeochernt, damit die Werte beim erneuten Appstart in die Felder eingesetzt werden können. Zur Berechnung der Empfehlungen werden die eingebebenen Daten einmalig anonym an den Server gesendet. Diese werden über die Berechnung hinaus nicht auf dem Server gespeichert.</ContentText>
            </ScrollView>
        </RootView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        marginHorizontal: 8
    },
    heading: {
        marginVertical: 8
    }
})

export default PrivacyScreen
