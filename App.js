import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Appearance } from 'react-native-appearance';

import {lightTheme, darkTheme } from './src/constants/Colors';
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
import { StateProvider, useStateValue } from './src/StateProvider';

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

  const scheme = Appearance.getColorScheme()
  const initialState = {
    scheme: scheme,
    colorTheme: scheme === 'dark' ? darkTheme : lightTheme
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'changeTheme':
        const newScheme = state.scheme === 'dark' ? 'light' : 'dark'
        return {
          ...state,
          scheme: newScheme,
          colorTheme: newScheme === 'dark' ? darkTheme : lightTheme
        }
    }
  }

  const state = useStateValue()
  const colorTheme = state !== undefined ? state.colorTheme : initialState.colorTheme

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null; /* Handled by splash screen. */
  } else {
    return (
      <StateProvider initialState={initialState} reducer={reducer}>
        <View style={{...styles.container, backgroundColor: colorTheme.background}}>
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
                name="Root"
                component={BottomTabNavigator}
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
            </Stack.Navigator>
          </NavigationContainer>
        </View >
      </StateProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
