import React from 'react'
import { StyleSheet, View } from 'react-native'

import RootView from '../components/common/RootView'
import InformationCard, { InformationText } from '../components/common/InformationCard'
import SettingsToggleView from '../components/SettingsToggleView'
import IconButton from '../components/common/IconButton'

const FormHelpScreen = (props) => {
    function onSendContactPressed() {

    }

    const sendQuestionToggle = (<View>
        <SettingsToggleView icon="clipboard-text" name="Gegebene Antworten einbeziehen." style={styles.toggle} />
    </View>)

    const sendEvaluationToggle = (<View>
        <SettingsToggleView icon="chart-areaspline" name="Erhaltene Empfehlungen einbeziehen." style={styles.toggle} />
    </View>)

    const sendContactButton = (<View style={styles.toggle} o>
        <IconButton icon="send" text="Jetzt Kontakt aufnehmen!" onPress={onSendContactPressed} />
    </View>)

    return (
        <RootView style={styles.container}>
            <InformationCard icon="numeric-1-circle-outline" style={styles.card} title="Fragen zum Fragebogen?" contentView={sendQuestionToggle}>
                <InformationText>Sollten beim Beantworten des Fragebogens Fragen aufkommen oder etwas unklar bleiben, zögern Sie nicht uns zu kontaktieren.</InformationText>
            </InformationCard>
            <InformationCard icon="numeric-2-circle-outline" style={styles.card} title="Fragen zur Maßnahmenempfehlung?" contentView={sendEvaluationToggle}>
                <InformationText>Dies gilt genauso, falls Sie zu den Ergebnissen der Empfehlungsberechnung, oder den konkreten Maßnahmen Rückfragen haben.</InformationText>
            </InformationCard>
            <InformationCard icon="numeric-3-circle-outline" style={styles.card} title="So funktioniert's!" contentView={sendContactButton}>
                <InformationText>Um den Austausch mit einem Mitarbeiter des Mittelstand 4.0 Kompetenzzentrums zu vereinfachen, wird zur Übersicht ein Dokument mit Ihren Antworten und den erhaltenen Bewertungen erstellt und an Sie und uns per Mail gesendet.</InformationText>
            </InformationCard>
        </RootView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 8,
    },
    card: {
        marginTop: 8
    },
    toggle: {
        margin: 8
    }
})

export default FormHelpScreen
