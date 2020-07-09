import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ContentText } from '../components/Text'

const PrivacyScreen = (props) => {

    return (
        <View style={styles.container}>
            <ContentText style={styles.subHeading}>Letzte Änderung: 08. November 2019</ContentText>
            <ContentText>Im Folgenden erläutern wir, welche Informatione während der Nutztun der Applikation erfasst und verarbeitet werden.</ContentText>
            <ContentText style={styles.subHeading}>Personenenbezogenen Daten</ContentText>
            <ContentText>Diese Applikation sammelt keine personenbezogenen Daten. Eingaben des Nutzers werden nur lokal auf dem Gerät zur benutzerfreundlichen Bedienung gespeochernt, damit die Werte beim erneuten Appstart in die Felder eingesetzt werden können. Zur Berechnung der Empfehlungen werden die eingebebenen Daten einmalig anonym an den Server gesendet. Diese werden über die Berechnung hinaus nicht auf dem Server gespeichert.</ContentText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    subHeading:{
        marginVertical: 16,
        fontWeight: 'bold'
    }
})

export default PrivacyScreen;