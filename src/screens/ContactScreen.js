import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import InformationCard, { InformationHighlight, InformationText } from '../components/InformationCard';


const ContactScreen = (props) => {

    return (
        <View style={styles.container}>
            <InformationCard style={styles.welcomeCard}>
                <InformationText style={styles.welcomeText}>An dieser Stelle können Sie uns kontaktieren.</InformationText>
            </InformationCard>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    welcomeCard: {
        margin: 8
    },
})

export default ContactScreen;