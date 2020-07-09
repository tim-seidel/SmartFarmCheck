import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Colors from './src/constants/Colors';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import MeasureDetailScreen from "./src/screens/MeasureDetailScreen";
import ContactScreen from "./src/screens/ContactScreen";
import ImprintScreen from "./src/screens/ImprintScreen";
import PrivacyScreen from "./src/screens/PrivacyScreen";
import FormScreen from "./src/screens/FormScreen";
import EvaluationScreen from './src/screens/EvaluationScreen';
import EvaluationDetailScreen from './src/screens/EvaluationDetailScreen';

const Stack = createStackNavigator();

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

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
        {<StatusBar backgroundColor={Colors.secondary} barStyle="default" />}
        <NavigationContainer>
          <Stack.Navigator >
            <Stack.Screen
              options={{
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: Colors.primary
                }
              }}
              name="Root"
              component={BottomTabNavigator}
            />
            <Stack.Screen
              options={{
                title: "Maßnahmeninformation",
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: Colors.primary
                }
              }}
              name="MeasureDetail"
              component={MeasureDetailScreen} />
            <Stack.Screen
              options={{
                title: "Angaben zum Betrieb",
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: Colors.primary
                }
              }}
              name="Form"
              component={FormScreen} />
            <Stack.Screen
              options={{
                title: "Maßnahmeninformation",
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: Colors.primary
                }
              }}
              name="EvaluationDetail"
              component={EvaluationDetailScreen} />
            <Stack.Screen
              options={{
                title: "Maßnahmenbewertung",
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: Colors.primary
                }
              }}
              name="Evaluation"
              component={EvaluationScreen} />
            <Stack.Screen
              options={{
                title: "Kontakt",
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: Colors.primary
                }
              }}
              name="Contact"
              component={ContactScreen} />
            <Stack.Screen
              options={{
                title: "Impressum",
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: Colors.primary
                }
              }}
              name="Imprint"
              component={ImprintScreen} />
            <Stack.Screen
              options={{
                title: "Datenschutz",
                headerTintColor: "#fff",
                headerStyle: {
                  backgroundColor: Colors.primary
                }
              }}
              name="Privacy"
              component={PrivacyScreen} />
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
