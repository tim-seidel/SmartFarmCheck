import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Switch } from 'react-native'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import AsyncStorage from '@react-native-community/async-storage'

import { useThemeProvider } from '../ThemeContext'
import { ContentText } from '../components/Text'
import { ConstantColors } from '../constants/Colors'
import Layout from '../constants/Layout'

const SettingsToggleView = (props) => {
    const [isEnabled, setIsEnabled] = useState(props.initalValue ?? false)
    const { colorTheme } = useThemeProvider()

    useEffect(() => {
        if(props.storeKey){
            AsyncStorage.getItem(props.storeKey, (error, value) => {
                if (!error && value != null) {
                    setIsEnabled(JSON.parse(value))
                }
            })
        }
    }, [])

    const toggleSwitch = (value) => {
        setIsEnabled(value)
        if(props.onValueChanged){
            props.onValueChanged(value)
        }
        if(props.storeKey){
            AsyncStorage.setItem(props.storeKey, JSON.stringify(value))
        }
    }

    return (
        <View style={{ ...styles.switchSetting, backgroundColor: colorTheme.componentBackground, ...props.style }}>
            <Icon style={{ color: colorTheme.textPrimary }} name={props.icon} size={24}></Icon>
            <View style={styles.nameWrapper}>
                <ContentText>{props.name}</ContentText>
            </View>
            <Switch onValueChange={toggleSwitch} value={isEnabled}
                thumbColor={isEnabled ? colorTheme.primary : ConstantColors.lightgrey}
                trackColor={{ false: ConstantColors.grey, true: colorTheme.accent }} />
        </View>
    )
}

const styles = StyleSheet.create({
    switchSetting: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderColor: Layout.borderColor,
        borderRadius: Layout.borderRadius,
        borderWidth: Layout.borderWidth

    },
    nameWrapper: {
        flex: 1,
        marginStart: 16,
        marginEnd: 8,
        paddingVertical: 16
    }
})

export default SettingsToggleView