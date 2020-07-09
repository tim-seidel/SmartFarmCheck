import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Colors from '../constants/Colors'
import { HeadingText, ContentText } from './Text';

/*
 * A basic UI element that displays text in a card like style.
 * Usage:
 * <InformationCard>
 *  <InfomationText>Some text with some</InformationText>
 *  <InfromationHighlight>highlight</InformationHighlight>
 *  <InformationText> inbetween.</InformationText>
 * </InfomationCard>
 */

export function InformationHighlight(props) {
    return <HeadingText style={styles.highlight}>{props.children}</HeadingText>
}

export function InformationText(props) {
    return <ContentText light>{props.children}</ContentText>
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
        borderColor: Colors.grey,
        borderWidth: 1.5
    },
    textWrapper: {
        textAlign: "center"
    }
})

export default InformationCard;