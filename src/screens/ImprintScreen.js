import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const ImprintScreen = (props) => {

    return (
        <View style={styles.container}>
            <Text>Hochschule Osnabrück</Text>
            <Text>Albrechtstraße 30</Text>
            <Text>49076 Osnabrück</Text>
            <Text>Deutschland</Text>
            <Text></Text>
            <Text>Tel: +49 541 969-0</Text>
            <Text>Fax: +49 541 969-2066</Text>
            <Text></Text>
            <Text>Die Hochschule ist eine Körperschaft öffetnlichen Rechts in der Trägerschaft einer Stiftung des öffentlichen Rechts. Sie wird durch den Präsidenten Prof. Dr. Andreas Bertram gesetzlich vertreten.</Text>
            <Text></Text>
            <Text>Zuständige Aufsichtsbehörde ist gem. §§59 Abs. 1, 60. Abs. 2 NHG der Stiftungsrat der Stiftung Hochschule Osnabrück, Albrechtstraße 30 49076 Osnabrück.</Text>
            <Text></Text>
            <Text>Umsatzsteuer-ID: DE 812 619 579</Text>
            <Text></Text>
            <Text>Redaktion - verantowrtlich nach § 55 (2) RStV: </Text>
            <Text></Text>
            <Text>Ralf Garten</Text>
            <Text>Tel: +49 541 969-2177</Text>
            <Text>webmaster@hs-osnabrueck.de</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
})

export default ImprintScreen;