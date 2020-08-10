import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { HeadingText, ContentText } from './Text';
import Layout from '../constants/Layout';
import { useThemeProvider } from '../ThemeContext';

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
    return <HeadingText>{props.children}</HeadingText>
}

export function InformationText(props) {
    return <ContentText light>{props.children}</ContentText>
}

const InformationCard = (props) => {
    const {colorTheme} = useThemeProvider()

    return (
        <View style={{ ...styles.card, backgroundColor: colorTheme.componentBackground, ...props.style }}>
            <View style={{...styles.titleWrapper, backgroundColor: colorTheme.primary}}>
                <HeadingText style={{...styles.titleText, color: colorTheme.textPrimaryContrast}}>{props.title ?? 'Information'}</HeadingText>
            </View>
                <View style={styles.textWrapper}>
                    <Text style={styles.text} >
                        {props.children}
                    </Text>
                </View>
                {props.contentView}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        borderRadius: Layout.borderRadius,
        borderColor: Layout.borderColor,
        borderWidth: Layout.borderWidth,
        overflow: 'hidden',
        paddingBottom: 8
    },
    titleWrapper: {
        minHeight: 16,
    },
    titleText: {
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    textWrapper: {
        margin: 8
    },
    text: {
        textAlign: 'center'
    }
})

export default InformationCard;