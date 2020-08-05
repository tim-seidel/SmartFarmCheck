import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useStateValue } from '../StateProvider'
import InformationCard, { InformationText } from '../components/InformationCard'

const FeedbackScreen = (props) => {
    const [{colorTheme}] = useStateValue()

    return (
        <View style={{...styles.container, backgroundColor: colorTheme.background}}>
            <InformationCard style={styles.card} title="Work in progress">
                <InformationText>An der Möglichkeit zum spezifischen Feedback zu Problemen und Aktionen in der App wird gerade gearbeitet.</InformationText>
            </InformationCard>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    card:{
        margin: 8
    }
})

export default FeedbackScreen;