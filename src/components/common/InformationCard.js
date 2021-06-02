import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { HeadingText, ContentText } from './Text'

import Layout from '../../constants/Layout'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import { darkTheme, lightTheme } from '../../constants/Colors'
import Strings from '../../constants/Strings'

/**
 * @summary Helper class for content inside a InformationCard that should be highlighted.
 * @param {Object} props The standard react native ui props.
 * @see InformationCard
 */
export function InformationHighlight(props) {
    return <HeadingText>{props.children}</HeadingText>
}

/**
 * @summary Helper class for default content inside a InformationCard.
 * @param {Object} props The standard react native ui props.
 * @see InfomationCard
 */
export function InformationText(props) {
    return <ContentText light>{props.children}</ContentText>
}

/**
 * @summary Hekper class for linebreaks between content indside a InformationCard.
 * @param {Object} props The standard react native ui props.
 * @see InformationCard
 */
export function InformationLineBreak(props) {
    const nBreaks = Math.max(props.breaks ?? 1, 1)
    let breaks = "\n"
    for (let i = 1; i < nBreaks; ++i) breaks += "\n"

    return <ContentText>{breaks}</ContentText>
}

/**
 * @summary A basic UI element that displays text in a card like style. The content can be toggled.
 * @description Usage:
 * <InformationCard>
 *  <InfomationText>Some text with some</InformationText>
 *  <InfromationHighlight>highlight</InformationHighlight>
 *  <InformationText> inbetween.</InformationText>
 * </InfomationCard>
 * @param {Object} props The standard react native ui props. 
 * @see InformationHighlight
 * @see InformationText
 * @see InformationLineBreak
 */
const InformationCard = (props) => {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

    const toggleInformationEnabled = props.toggleInformationEnabled ?? false    //Prop that defines if the content can be expanded or hidden 
    const toggleStoreKey = props.toggleStoreKey                                 //A key that needs to be provided if the user can control the content state. Its used to store and access the state locally
    const [isInformationInvisible, setInformationVisible] = useState(!toggleInformationEnabled) //Current state whether the content is expanded or hidden

    //Check if the information toggle by the user is enabled, and if so get the current stored state
    useEffect(() => {
        if (toggleInformationEnabled) {
            if (!props.toggleStoreKey) throw Error("If toggleInformationEnabled is set, a toggleStoreKey must be provided aswell.")
            AsyncStorage.getItem(props.toggleStoreKey, (error, value) => {
                setInformationVisible(JSON.parse(value) ?? (props.initialValue ?? false))
            })
        }
    }, [])

    //Toggles and stores the information state
    function toggleInformationVisibility() {
        if (!toggleInformationEnabled) return
        if (!toggleStoreKey) throw Error("If toggleInformationEnabled is set, a toggleStoreKey must be provided.")

        const toggleValue = !isInformationInvisible
        setInformationVisible(toggleValue)
        AsyncStorage.setItem(toggleStoreKey, JSON.stringify(toggleValue))
    }

    //Layout
    return (
        <View style={{ ...styles.card, backgroundColor: colorTheme.componentBackground, ...props.style }}>
            <View style={{ ...styles.titleRow, backgroundColor: colorTheme.primary }}>
                {props.icon && <Icon name={props.icon} size={24} style={{ marginStart: 8, color: colorTheme.textPrimaryContrast }} />}
                <View style={styles.titleWrapper}>
                    <HeadingText style={{ color: colorTheme.textPrimaryContrast }}>{props.title ?? Strings.information_card_default_title}</HeadingText>
                </View>
                {toggleInformationEnabled && <Icon name={isInformationInvisible ? "chevron-up" : "chevron-down"} size={24} style={{ ...styles.minimizeIcon, color: colorTheme.textPrimaryContrast }} onPress={toggleInformationVisibility}></Icon>}
            </View>
            {props.children && <View style={styles.textWrapper}>
                <Text style={{ textAlign: props.textAlign ?? 'center' }} >
                    {isInformationInvisible ? props.children : <ContentText small light>{Strings.information_card_advice_expand}</ContentText>}
                </Text>
            </View>
            }
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
