import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Colors from '../constants/Colors'
import { HeadingText, ContentText } from './Text';
import Layout from '../constants/Layout';

/**
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
            <View style={styles.titleWrapper}>
                <HeadingText style={styles.titleText}>{props.title ?? 'Information'}</HeadingText>
            </View>
            <Text style={styles.textWrapper} >
                {props.children}
            </Text>
            {props.contentView}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.white,
        borderRadius: Layout.borderRadius,
        borderColor: Layout.borderColor,
        borderWidth: Layout.borderWidth,
        paddingBottom: 8
    },
    titleWrapper:{
        backgroundColor: Colors.primary,
        minHeight: 16,
    },
    titleText:{
        color: Colors.white,
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    textWrapper: {
        padding: 8,
        textAlign: 'center'
    }
})

export default InformationCard;