import React from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'

import MeasureDetailScreen from "../screens/MeasureDetailScreen"
import AboutScreen from "../screens/AboutScreen"
import ImprintScreen from "../screens/ImprintScreen"
import PrivacyScreen from "../screens/PrivacyScreen"
import FormScreen from "../screens/FormScreen"
import EvaluationScreen from '../screens/EvaluationScreen'
import EvaluationDetailScreen from '../screens/EvaluationDetailScreen'
import EventDetailScreen from '../screens/EventDetailScreen'
import VideoScreen from '../screens/VideoScreen'
import AudioScreen from '../screens/AudioScreen'
import HomeScreen from '../screens/HomeScreen'
import FormSelectScreen from '../screens/FormSelectScreen'
import SettingsScreen from '../screens/SettingsScreen'
import LicenseScreen from '../screens/LicenseScreen'
import ContactRequestScreen from '../screens/ContactRequestScreen'

import { ABOUTSCREEN, AUDIOSCREEN, EVALUATIONDETAILSCREEN, EVALUATIONSCREEN, EVENTDETAILSCREEN, CONTACTREQUESTSCREEN, FORMSCREEN, FORMSELECTSCREEN, HOMESCREEM, IMPRINTSCREEN, LICENSESCREEN, MEASUREDETAILSCREEN, PRIVACYSCREEN, SETTINGSSCREEN, VIDEOSCREEN } from '../constants/Paths'
import { darkTheme, lightTheme } from '../constants/Colors'
import Strings from '../constants/Strings'

const Stack = createStackNavigator()

const Content = (props) => {
	const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

	return (
		<View style={{ ...styles.container, backgroundColor: colorTheme.background }}>
			<NavigationContainer>
				<Stack.Navigator >
					<Stack.Screen
						options={{
							headerTintColor: colorTheme.textPrimaryContrast,
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={HOMESCREEM}
						component={HomeScreen}
					/>
					<Stack.Screen
						options={{
							title: Strings.screen_title_measure_detail,
							headerTintColor: colorTheme.textPrimaryContrast,
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={MEASUREDETAILSCREEN}
						component={MeasureDetailScreen} />
					<Stack.Screen
						options={{
							title: Strings.screen_title_form,
							headerTintColor: colorTheme.textPrimaryContrast,
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={FORMSCREEN}
						component={FormScreen} />
					<Stack.Screen
						options={{
							title: Strings.screen_title_evaluation_detail,
							headerTintColor: colorTheme.textPrimaryContrast,
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={EVALUATIONDETAILSCREEN}
						component={EvaluationDetailScreen} />
					<Stack.Screen
						options={{
							title: Strings.screen_title_evaluation,
							headerTintColor: "#fff",
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={EVALUATIONSCREEN}
						component={EvaluationScreen} />
					<Stack.Screen
						options={{
							title: Strings.screen_title_about,
							headerTintColor: colorTheme.textPrimaryContrast,
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={ABOUTSCREEN}
						component={AboutScreen} />
					<Stack.Screen
						options={{
							title: Strings.screen_title_imprint,
							headerTintColor: colorTheme.textPrimaryContrast,
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={IMPRINTSCREEN}
						component={ImprintScreen} />
					<Stack.Screen
						options={{
							title: Strings.screen_title_privacy,
							headerTintColor: colorTheme.textPrimaryContrast,
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={PRIVACYSCREEN}
						component={PrivacyScreen} />
					<Stack.Screen
						options={{
							title: Strings.screen_title_event_detail,
							headerTintColor: colorTheme.textPrimaryContrast,
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={EVENTDETAILSCREEN}
						component={EventDetailScreen} />
					<Stack.Screen
						options={{
							title: Strings.screen_title_video_player,
							headerTintColor: colorTheme.textPrimaryContrast,
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={VIDEOSCREEN}
						component={VideoScreen} />
					<Stack.Screen
						options={{
							title: Strings.screen_title_audio_player,
							headerTintColor: colorTheme.textPrimaryContrast,
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={AUDIOSCREEN}
						component={AudioScreen} />
					<Stack.Screen
						options={{
							title: Strings.screen_title_form_list,
							headerTintColor: colorTheme.textPrimaryContrast,
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={FORMSELECTSCREEN}
						component={FormSelectScreen} />
					<Stack.Screen
						options={{
							title: Strings.screen_title_form_help,
							headerTintColor: colorTheme.textPrimaryContrast,
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={CONTACTREQUESTSCREEN}
						component={ContactRequestScreen} />
					<Stack.Screen
						options={{
							title: Strings.screen_title_settings,
							headerTintColor: colorTheme.textPrimaryContrast,
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={SETTINGSSCREEN}
						component={SettingsScreen} />
					<Stack.Screen
						options={{
							title: Strings.screen_title_license,
							headerTintColor: colorTheme.textPrimaryContrast,
							headerStyle: {
								backgroundColor: colorTheme.primary
							}
						}}
						name={LICENSESCREEN}
						component={LicenseScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</View >
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
})

export default Content
