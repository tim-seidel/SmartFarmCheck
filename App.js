import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import {ColorTheme} from './src/constants/Colors';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import MeasureDetailScreen from "./src/screens/MeasureDetailScreen";
import AboutScreen from "./src/screens/AboutScreen";
import ImprintScreen from "./src/screens/ImprintScreen";
import PrivacyScreen from "./src/screens/PrivacyScreen";
import FormScreen from "./src/screens/FormScreen";
import EvaluationScreen from './src/screens/EvaluationScreen';
import EvaluationDetailScreen from './src/screens/EvaluationDetailScreen';
import EventDetailScreen from './src/screens/EventDetailScreen';
import FeedbackScreen from './src/screens/FeedbackScreen';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false)

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();
        /* Additional loading should be put here.*/
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null; /* Handled by splash screen. */
  } else {
    return (
      <View style={styles.container}>
        {<StatusBar backgroundColor={ColorTheme.current.secondary} barStyle="default" />}
        <NavigationContainer>
          <Stack.Navigator >
            <Stack.Screen
              options={{
                headerTintColor: ColorTheme.current.textPrimaryContrast,
                headerStyle: {
                  backgroundColor: ColorTheme.current.primary
                }
              }}
              name="Root"
              component={BottomTabNavigator}
            />
            <Stack.Screen
              options={{
                title: "Maßnahmeninformation",
                headerTintColor: ColorTheme.current.textPrimaryContrast,
                headerStyle: {
                  backgroundColor: ColorTheme.current.primary
                }
              }}
              name="MeasureDetail"
              component={MeasureDetailScreen} />
            <Stack.Screen
              options={{
                title: "Angaben zum Betrieb",
                headerTintColor: ColorTheme.current.textPrimaryContrast,
                headerStyle: {
                  backgroundColor: ColorTheme.current.primary
                }
              }}
              name="Form"
              component={FormScreen} />
            <Stack.Screen
              options={{
                title: "Maßnahmeninformation",
                headerTintColor: ColorTheme.current.textPrimaryContrast,
                headerStyle: {
                  backgroundColor: ColorTheme.current.primary
                }
              }}
              name="EvaluationDetail"
              component={EvaluationDetailScreen} />
            <Stack.Screen
              options={{
                title: "Maßnahmenbewertung",
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: ColorTheme.current.primary
                }
              }}
              name="Evaluation"
              component={EvaluationScreen} />
            <Stack.Screen
              options={{
                title: "Über diese App",
                headerTintColor: ColorTheme.current.textPrimaryContrast,
                headerStyle: {
                  backgroundColor: ColorTheme.current.primary
                }
              }}
              name="About"
              component={AboutScreen} />
            <Stack.Screen
              options={{
                title: "Impressum",
                headerTintColor: ColorTheme.current.textPrimaryContrast,
                headerStyle: {
                  backgroundColor: ColorTheme.current.primary
                }
              }}
              name="Imprint"
              component={ImprintScreen} />
            <Stack.Screen
              options={{
                title: "Datenschutz",
                headerTintColor: ColorTheme.current.textPrimaryContrast,
                headerStyle: {
                  backgroundColor: ColorTheme.current.primary
                }
              }}
              name="Privacy"
              component={PrivacyScreen} />
            <Stack.Screen
              options={{
                title: "Eventdetails",
                headerTintColor: ColorTheme.current.textPrimaryContrast,
                headerStyle: {
                  backgroundColor: ColorTheme.current.primary
                }
              }}
              name="EventDetail"
              component={EventDetailScreen} />
            <Stack.Screen
              options={{
                title: "Feedback geben",
                headerTintColor: ColorTheme.current.textPrimaryContrast,
                headerStyle: {
                  backgroundColor: ColorTheme.current.primary
                }
              }}
              name="Feedback"
              component={FeedbackScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </View >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
