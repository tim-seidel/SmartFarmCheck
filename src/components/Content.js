import React from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { useThemeProvider } from '../ThemeContext'
import MeasureDetailScreen from "../screens/MeasureDetailScreen"
import AboutScreen from "../screens/AboutScreen"
import ImprintScreen from "../screens/ImprintScreen"
import PrivacyScreen from "../screens/PrivacyScreen"
import FormScreen from "../screens/FormScreen"
import EvaluationScreen from '../screens/EvaluationScreen'
import EvaluationDetailScreen from '../screens/EvaluationDetailScreen'
import EventDetailScreen from '../screens/EventDetailScreen'
import FeedbackScreen from '../screens/FeedbackScreen'
import VideoScreen from '../screens/VideoScreen'
import AudioScreen from '../screens/AudioScreen'
import HomeScreen from '../screens/HomeScreen'
import FormSelectScreen from '../screens/FormSelectScreen'
import SettingsScreen from '../screens/SettingsScreen'
import LicenseScreen from '../screens/LicenseScreen'
import { ABOUTSCREEN, AUDIOSCREEN, EVALUATIONDETAILSCREEN, EVALUATIONSCREEN, EVENTDETAILSCREEN, FEEDBACKSCREEN, FORMSCREEN, FORMSELECTSCREEN, HOMESCREEM, IMPRINTSCREEN, LICENSESCREEN, MEASUREDETAILSCREEN, PRIVACYSCREEN, SETTINGSSCREEN, VIDEOSCREEN } from '../constants/Paths'

const Stack = createStackNavigator()

const Content = (props) => {
    const { colorTheme } = useThemeProvider()

    return (
        <View style={{ ...styles.container, backgroundColor: colorTheme.background }}>
            {<StatusBar backgroundColor={colorTheme.secondary} barStyle="default" />}
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
                            title: "Maßnahmeninformation",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name={MEASUREDETAILSCREEN}
                        component={MeasureDetailScreen} />
                    <Stack.Screen
                        options={{
                            title: "Angaben zum Betrieb",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name={FORMSCREEN}
                        component={FormScreen} />
                    <Stack.Screen
                        options={{
                            title: "Maßnahmeninformation",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name={EVALUATIONDETAILSCREEN}
                        component={EvaluationDetailScreen} />
                    <Stack.Screen
                        options={{
                            title: "Maßnahmenbewertung",
                            headerTintColor: "#fff",
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name={EVALUATIONSCREEN}
                        component={EvaluationScreen} />
                    <Stack.Screen
                        options={{
                            title: "Über diese App",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name={ABOUTSCREEN}
                        component={AboutScreen} />
                    <Stack.Screen
                        options={{
                            title: "Impressum",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name={IMPRINTSCREEN}
                        component={ImprintScreen} />
                    <Stack.Screen
                        options={{
                            title: "Datenschutz",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name={PRIVACYSCREEN}
                        component={PrivacyScreen} />
                    <Stack.Screen
                        options={{
                            title: "Eventdetails",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name={EVENTDETAILSCREEN}
                        component={EventDetailScreen} />
                    <Stack.Screen
                        options={{
                            title: "Feedback/Hilfe",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name={FEEDBACKSCREEN}
                        component={FeedbackScreen} />
                    <Stack.Screen
                        options={{
                            title: "Video-Player",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name={VIDEOSCREEN}
                        component={VideoScreen} />
                    <Stack.Screen
                        options={{
                            title: "Audio-Player",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name={AUDIOSCREEN}
                        component={AudioScreen} />
                    <Stack.Screen
                        options={{
                            title: "Fragebogenauswahl",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name={FORMSELECTSCREEN}
                        component={FormSelectScreen} />
                    <Stack.Screen
                        options={{
                            title: "Einstellungen",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name={SETTINGSSCREEN}
                        component={SettingsScreen} />
                    <Stack.Screen
                        options={{
                            title: "Lizenzen",
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
