import React from 'react'
import { View, StyleSheet } from 'react-native'

import { useThemeProvider } from '../ThemeContext'
import InformationCard, { InformationText } from '../components/InformationCard'

const LicenseScreen = (props) => {
    const { colorTheme } = useThemeProvider()

    return (
        <View style={{ ...styles.container, backgroundColor: colorTheme.background }}>
            <InformationCard style={styles.card} title="Work in progress">
                <InformationText>Die Lizenzen werden zu einem späteren Zeitpnkt hinzugefügt. Diese App wurde mit React Native entwickelt.</InformationText>
            </InformationCard>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    card: {
        margin: 8
    }
})

export default LicenseScreen
