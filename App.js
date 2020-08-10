import 'react-native-gesture-handler';
import React, {useState} from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Appearance } from 'react-native-appearance';

import { lightTheme, darkTheme } from './src/constants/Colors';
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
import { ThemeContext } from './src/ThemeContext';
import VideoScreen from './src/screens/VideoScreen';
import AudioScreen from './src/screens/AudioScreen';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false)
  const [themeState, setThemeState] = useState({
    colorTheme: Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme,
    toggleTheme: () => {
      setThemeState(state => ({
        colorTheme: state.colorTheme === darkTheme ? lightTheme : darkTheme,
        toggleTheme: state.toggleTheme
      }))
    }
  })

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
  }, [])


  const colorTheme = themeState.colorTheme

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null; /* Handled by splash screen. */
  } else {
    return (
      <ThemeContext.Provider value={themeState}>
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
            </Stack.Navigator>
          </NavigationContainer>
        </View >
      </ThemeContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
