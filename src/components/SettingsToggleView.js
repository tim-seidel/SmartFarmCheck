import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Switch } from 'react-native'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import { darkTheme, lightTheme, ConstantColors } from '../constants/Colors'
import { ContentText, HeadingText } from './common/Text'
import Layout from '../constants/Layout'

const SettingsToggleView = (props) => {
    const [isEnabled, setIsEnabled] = useState(props.initalValue ?? false)
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

    useEffect(() => {
        if (props.storeKey) {
            AsyncStorage.getItem(props.storeKey, (error, value) => {
                if (!error && value != null) {
                    setIsEnabled(JSON.parse(value))
                }
            })
        }
    }, [])

    const toggleSwitch = (value) => {
        setIsEnabled(value)
        if (props.onValueChanged) {
            props.onValueChanged(value
            )
        }
        if (props.storeKey) {
            AsyncStorage.setItem(props.storeKey, JSON.stringify(value))
        }
    }

    const descriptionView = props.description ? (<ContentText light style={styles.description}>{props.description}</ContentText>) : null

    return (
        <View style={{ ...styles.container, backgroundColor: colorTheme.componentBackground, ...props.style }}>
            <View style={styles.titleRow}>
                <Icon style={{ color: colorTheme.textPrimary }} name={props.icon} size={24} />
                <View>
                    <HeadingText style={styles.name}>{props.name}</HeadingText>
                    {descriptionView}
                </View>
            </View>
            <Switch onValueChange={toggleSwitch} value={isEnabled}
                thumbColor={isEnabled ? colorTheme.primary : ConstantColors.lightgrey}
                trackColor={{ false: ConstantColors.grey, true: colorTheme.accent }} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderColor: Layout.borderColor,
        borderRadius: Layout.borderRadius,
        borderWidth: Layout.borderWidth

    },
    titleRow: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 8,
    },
    name: {
        marginHorizontal: 16
    },
    description: {
        marginHorizontal: 16,
        marginTop: 4
    },

})

export default SettingsToggleView