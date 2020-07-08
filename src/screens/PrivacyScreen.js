import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const PrivacyScreen = (props) => {

    return (
        <View style={styles.container}>
            <Text style={styles.subHeading}>Letzte Änderung: 08. November 2019</Text>
            <Text style={styles.text}>Im Folgenden erläutern wir, welche Informatione während der Nutztun der Applikation erfasst und verarbeitet werden.</Text>
            <Text style={styles.subHeading}>Personenenbezogenen Daten</Text>
            <Text style={styles.text}>Diese Applikation sammelt keine personenbezogenen Daten. Eingaben des Nutzers werden nur lokal auf dem Gerät zur benutzerfreundlichen Bedienung gespeochernt, damit die Werte beim erneuten Appstart in die Felder eingesetzt werden können. Zur Berechnung der Empfehlungen werden die eingebebenen Daten einmalig anonym an den Server gesendet. Diese werden über die Berechnung hinaus nicht auf dem Server gespeichert.</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    text:{
        fontSize: 16
    },
    subHeading:{
        fontSize: 16,
        marginVertical: 8,
        fontWeight: 'bold'
    }
})

export default PrivacyScreen;