import React from 'react'
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import BottomTabNavigator from '../screens/HomeScreen';
import MeasureDetailScreen from "../screens/MeasureDetailScreen";
import AboutScreen from "../screens/AboutScreen";
import ImprintScreen from "../screens/ImprintScreen";
import PrivacyScreen from "../screens/PrivacyScreen";
import FormScreen from "../screens/FormScreen";
import EvaluationScreen from '../screens/EvaluationScreen';
import EvaluationDetailScreen from '../screens/EvaluationDetailScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import VideoScreen from '../screens/VideoScreen';
import AudioScreen from '../screens/AudioScreen';
import { useThemeProvider } from '../ThemeContext';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import FormSelectScreen from '../screens/FormSelectScreen';

const Stack = createStackNavigator();

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
                        name="Home"
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
                        name="MeasureDetail"
                        component={MeasureDetailScreen} />
                    <Stack.Screen
                        options={{
                            title: "Angaben zum Betrieb",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name="Form"
                        component={FormScreen} />
                    <Stack.Screen
                        options={{
                            title: "Maßnahmeninformation",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name="EvaluationDetail"
                        component={EvaluationDetailScreen} />
                    <Stack.Screen
                        options={{
                            title: "Maßnahmenbewertung",
                            headerTintColor: "#fff",
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name="Evaluation"
                        component={EvaluationScreen} />
                    <Stack.Screen
                        options={{
                            title: "Über diese App",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name="About"
                        component={AboutScreen} />
                    <Stack.Screen
                        options={{
                            title: "Impressum",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name="Imprint"
                        component={ImprintScreen} />
                    <Stack.Screen
                        options={{
                            title: "Datenschutz",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name="Privacy"
                        component={PrivacyScreen} />
                    <Stack.Screen
                        options={{
                            title: "Eventdetails",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name="EventDetail"
                        component={EventDetailScreen} />
                    <Stack.Screen
                        options={{
                            title: "Feedback geben",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name="Feedback"
                        component={FeedbackScreen} />
                    <Stack.Screen
                        options={{
                            title: "Video-Player",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name="Video"
                        component={VideoScreen} />
                    <Stack.Screen
                        options={{
                            title: "Audio-Player",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name="Audio"
                        component={AudioScreen} />
                    <Stack.Screen
                        options={{
                            title: "Fragebogenauswahl",
                            headerTintColor: colorTheme.textPrimaryContrast,
                            headerStyle: {
                                backgroundColor: colorTheme.primary
                            }
                        }}
                        name="FormSelect"
                        component={FormSelectScreen} />
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

export default Content;