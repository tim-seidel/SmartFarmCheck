import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Switch, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-community/async-storage'

import { useThemeProvider } from '../ThemeContext'
import { ContentText } from '../components/Text'
import Keys from '../constants/Keys'
import { darkTheme, ConstantColors } from '../constants/Colors'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Strings from '../constants/Strings'
import Layout from '../constants/Layout'
import RootView from '../components/RootView'
import { LICENSESCREEN } from '../constants/Paths'

const SettingsToggleView = (props) => {
    const [isEnabled, setIsEnabled] = useState(props.initalValue ?? false)
    const { colorTheme } = useThemeProvider()

    useEffect(() => {
        AsyncStorage.getItem(props.storeKey, (error, value) => {
            if (!error && value != null) {
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
        <View style={{ ...styles.switchSetting, backgroundColor: colorTheme.componentBackground, ...props.style }}>
            <Icon style={{ color: colorTheme.textPrimary }} name={props.icon} size={24}></Icon>
            <View style={styles.nameWrapper}>
                <ContentText>{props.name}</ContentText>
            </View>
            <Switch onValueChange={toggleSwitch} value={isEnabled}
                thumbColor={isEnabled ? colorTheme.accent : ConstantColors.accent}
                trackColor={{ false: "#767577", true: colorTheme.primary }} />
        </View>
    )
}

const SettingsClickView = (props) => {
    const { colorTheme } = useThemeProvider()

    return (
        <View style={{ ...styles.outerWrapper, backgroundColor: colorTheme.componentBackground, ...props.style }}>
            <TouchableHighlight underlayColor={ConstantColors.grey} onPress={props.onPress}>
                <View style={styles.innerWrapper}>
                    <Icon style={{ color: colorTheme.textPrimary, marginStart: 8 }} name={props.icon} size={24}></Icon>
                    <View style={styles.nameWrapper}>
                        <ContentText>{props.name}</ContentText>
                    </View>
                    <Icon style={{ color: colorTheme.textPrimary, marginEnd: 8 }} name="chevron-right" size={24}></Icon>
                </View>
            </TouchableHighlight>
        </View>
    )
}

const SettingsScreen = (props) => {
    const { colorTheme, toggleTheme } = useThemeProvider()

    function resetFormsHandler() {
        Alert.alert(Strings.settings_reset_form_dialog_title, Strings.settings_reset_form_dialog_content, [
            { text: Strings.cancel, style: "default" },
            { text: Strings.reset, onPress: () => resetForms(), style: "destructive" }
        ],
            { cancelable: true }
        )
    }

    async function resetForms() {
        //TODO: Reset forms
        const keys = await AsyncStorage.getAllKeys();
        const formKeys = keys.filter(k => k.startsWith(Keys.PREFILL_PREFIX))

        await AsyncStorage.multiRemove(formKeys)
    }

    function licenseHandler() {
        props.navigation.navigate(LICENSESCREEN)
    }

    const isDark = colorTheme === darkTheme
    return (
        <RootView style={styles.container}>
            <SettingsToggleView storeKey={Keys.SETTING_DARKMODE} name={Strings.settings_darkmode_title} icon="brightness-6" initalValue={isDark} onValueChanged={toggleTheme}></SettingsToggleView>
            <SettingsClickView name={Strings.settings_reset_form_title} icon="delete" initalValue={isDark} onPress={resetFormsHandler}></SettingsClickView>
            <SettingsClickView name={Strings.settings_licenses_title} icon="copyright" initalValue={isDark} onPress={licenseHandler} ></SettingsClickView>
        </RootView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingStart: 8,
        paddingEnd: 8
    },
    switchSetting: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        borderRadius: 8,
        marginTop: 8,
        borderColor: Layout.borderColor,
        borderRadius: Layout.borderRadius,
        borderWidth: Layout.borderWidth

    },
    outerWrapper: {
        overflow: 'hidden',
        borderRadius: 8,
        marginTop: 8,
        borderColor: Layout.borderColor,
        borderRadius: Layout.borderRadius,
        borderWidth: Layout.borderWidth
    },
    innerWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    nameWrapper: {
        flex: 1,
        marginStart: 16,
        marginEnd: 8,
        paddingVertical: 16
    }
})

export default SettingsScreen
