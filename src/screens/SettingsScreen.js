import React from 'react'
import { StyleSheet, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

import RootView from '../components/common/RootView'
import SettingsClickView from '../components/SettingsClickView'

import Strings from '../constants/Strings'
import Keys from '../constants/Keys'
import { LICENSESCREEN } from '../constants/Paths'


const SettingsScreen = (props) => {
	function resetFormsHandler() {
		Alert.alert(Strings.settings_reset_form_dialog_title, Strings.settings_reset_form_dialog_content, [
			{ text: Strings.cancel, style: "default" },
			{ text: Strings.reset, onPress: () => resetForms(), style: "destructive" }
		],
			{ cancelable: true }
		)
	}

	async function resetForms() {
		const keys = await AsyncStorage.getAllKeys();
		const formKeys = keys.filter(k => k.startsWith(Keys.PREFILL_PREFIX))

		await AsyncStorage.multiRemove(formKeys)
	}

	function licenseHandler() {
		props.navigation.navigate(LICENSESCREEN)
	}

	return (
		<RootView>
			<SettingsClickView
				style={styles.settingsItem}
				icon="brightness-6"
				name={Strings.settings_appearance_title}
				description={Strings.settings_appearance_description} />
			<SettingsClickView
				style={styles.settingsItem}
				icon="delete"
				name={Strings.settings_reset_form_title}
				description={Strings.settings_reset_form_description}
				onPress={resetFormsHandler} />
			<SettingsClickView
				style={styles.settingsItem}
				icon="copyright"
				name={Strings.settings_licenses_title}
				description={Strings.settings_licenses_description}
				onPress={licenseHandler} />
		</RootView>
	)
}

const styles = StyleSheet.create({
	settingsItem: {
		marginTop: 8,
		marginHorizontal: 8
	}
})

export default SettingsScreen
