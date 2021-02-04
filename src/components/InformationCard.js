import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { HeadingText, ContentText } from './Text'
import Layout from '../constants/Layout'
import { useThemeProvider } from '../ThemeContext'

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
    const { colorTheme } = useThemeProvider()
    const [isInformationInvisible, setInformationVisible] = useState(true)

    const toggleInformationEnabled = props.toggleInformationEnabled ?? false

    useEffect(() => {
        if (toggleInformationEnabled) {
            if(!props.toggleStoreKey) throw Error("If toggleInformationEnabled is set, a toggleStoreKey must be provided aswell.")
            AsyncStorage.getItem(props.toggleStoreKey, (error, value) => {
                setInformationVisible(JSON.parse(value) ?? (props.initialValue ?? true))
            })
        }
    }, [])

    function toggleInformationVisibility() {
        if(!props.toggleStoreKey) throw Error("If toggleInformationEnabled is set, a toggleStoreKey must be provided aswell.")

        const newVal = !isInformationInvisible
        setInformationVisible(newVal)
        AsyncStorage.setItem(props.toggleStoreKey, JSON.stringify(newVal))
    }

    return (
        <View style={{ ...styles.card, backgroundColor: colorTheme.componentBackground, ...props.style }}>
            <View style={{ ...styles.titleRow, backgroundColor: colorTheme.primary }}>
                {props.icon && <Icon name={props.icon} size={24} style={{ marginStart: 8, color: colorTheme.textPrimaryContrast }}/>}
                <View style={styles.titleWrapper}>
                    <HeadingText style={{ color: colorTheme.textPrimaryContrast }}>{props.title ?? 'Information'}</HeadingText>
                </View>
                {toggleInformationEnabled && <Icon name={isInformationInvisible ? "chevron-up" : "chevron-down"} size={24} style={{ ...styles.minimizeIcon, color: colorTheme.textPrimaryContrast }} onPress={toggleInformationVisibility}></Icon>}
            </View>
            <View style={styles.textWrapper}>
                <Text style={{textAlign: props.textAlign ?? 'center'}} >
                    {isInformationInvisible ? props.children : <ContentText small light>Ausklappen für weitere Infos.</ContentText>}
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
    },
    titleRow: {
        minHeight: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    titleWrapper: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 4
    },
    textWrapper: {
        margin: 8
    },
    minimizeIcon: {
        marginEnd: 8
    }
})

export default InformationCard
