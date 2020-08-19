import React from 'react'
import { StyleSheet } from 'react-native'

import InformationCard, { InformationText } from '../components/InformationCard'
import RootView from '../components/RootView'

const LicenseScreen = (props) => {
    return (
        <RootView>
            <InformationCard style={styles.card} title="Work in progress">
                <InformationText>Die Lizenzen werden zu einem späteren Zeitpnkt hinzugefügt. Diese App wurde mit React Native entwickelt.</InformationText>
            </InformationCard>
        </RootView>
    )
}

const styles = StyleSheet.create({
    card: {
        margin: 8
    }
})

export default LicenseScreen
