import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Colors from '../constants/Colors'

export function InformationHighlight(props) {
    return <Text style={styles.highlight}>{props.children}</Text>
}

export function InformationText(props) {
    return <Text style={styles.text}>{props.children}</Text>
}

const InformationCard = (props) => {
    return (
        <View style={{ ...styles.card, ...props.style }}>
            <Text style={styles.textWrapper} >
                {props.children}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: 8,
        paddingVertical: 16,
        borderRadius: 8,
        borderColor: Colors.greyInactive,
        borderWidth: 1.5
    },
    textWrapper: {
        textAlign: "center"
    },
    highlight: {
        fontSize: 20,
        fontWeight: "800",
        color: "black"
    },
    text: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)'
    },
})

export default InformationCard;