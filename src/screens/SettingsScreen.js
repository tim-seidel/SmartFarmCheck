import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Switch } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage'

import { useThemeProvider } from '../ThemeContext'
import { ContentText } from '../components/Text';
import { Appearance } from 'react-native-appearance';
import Keys from '../constants/Keys';
import { darkTheme } from '../constants/Colors';

const SettingsView = (props) => {
  
    const [isEnabled, setIsEnabled] = useState(props.initalValue ?? false);
    const { colorTheme } = useThemeProvider()

    useEffect(() => {
        AsyncStorage.getItem(props.storeKey, (error, value) => {
            if (!error && value !== null) {
                setIsEnabled(JSON.parse(value))
            }
        })
    }, [])


    const toggleSwitch = (value) => {
        setIsEnabled(value)
        props.onValueChanged(value)
        AsyncStorage.setItem(props.storeKey, JSON.stringify(value))
    }

    return (
        <View style={{ ...styles.setting, backgroundColor: colorTheme.componentBackground }}>
            <Icon style={{ color: colorTheme.textPrimary }} name={props.icon} size={32}></Icon>
            <View style={styles.nameWrapper}>
                <ContentText>{props.name}</ContentText>
            </View>
            <Switch onValueChange={toggleSwitch} value={isEnabled} />
        </View>
    )
}

const SettingsScreen = (props) => {
    const { colorTheme, toggleTheme } = useThemeProvider()

    return (
        <View style={{ ...styles.container, backgroundColor: colorTheme.background }}>
            <SettingsView storeKey={Keys.SETTING_DARKMODE} name="Dunkelmodus" icon="brightness-6" initalValue={colorTheme === darkTheme} onValueChanged={toggleTheme}></SettingsView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    setting: {
        paddingHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    nameWrapper: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 16
    }
})

export default SettingsScreen;