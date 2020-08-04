import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ContentText } from '../components/Text'
import { ScrollView } from 'react-native-gesture-handler'
import {ColorTheme} from'../constants/Colors'

const ImprintScreen = (props) => {

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <ContentText>Hochschule Osnabrück</ContentText>
                <ContentText>Albrechtstraße 30</ContentText>
                <ContentText>49076 Osnabrück</ContentText>
                <ContentText>Deutschland</ContentText>
                <ContentText></ContentText>
                <ContentText>Tel: +49 541 969-0</ContentText>
                <ContentText>Fax: +49 541 969-2066</ContentText>
                <ContentText></ContentText>
                <ContentText>Die Hochschule ist eine Körperschaft öffetnlichen Rechts in der Trägerschaft einer Stiftung des öffentlichen Rechts. Sie wird durch den Präsidenten Prof. Dr. Andreas Bertram gesetzlich vertreten.</ContentText>
                <ContentText></ContentText>
                <ContentText>Zuständige Aufsichtsbehörde ist gem. §§59 Abs. 1, 60. Abs. 2 NHG der Stiftungsrat der Stiftung Hochschule Osnabrück, Albrechtstraße 30 49076 Osnabrück.</ContentText>
                <ContentText></ContentText>
                <ContentText>Umsatzsteuer-ID: DE 812 619 579</ContentText>
                <ContentText></ContentText>
                <ContentText>Redaktion - verantowrtlich nach § 55 (2) RStV: </ContentText>
                <ContentText></ContentText>
                <ContentText>Ralf Garten</ContentText>
                <ContentText>Tel: +49 541 969-2177</ContentText>
                <ContentText>webmaster@hs-osnabrueck.de</ContentText>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ColorTheme.current.background
    },
    scrollView: {
        marginHorizontal: 8,
        marginTop: 8
    }
})

export default ImprintScreen;