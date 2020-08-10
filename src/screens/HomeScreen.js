
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import EventScreen from './EventScreen';
import MeasureScreen from './MeasureScreen';
import ContactScreen from "./ContactScreen"
import { useThemeProvider } from '../ThemeContext';
import { ConstantColors } from '../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import ToolbarButton from '../components/ToolbarButton';
import TabBarIcon from '../components/TabBarIcon';

const BottomTab = createBottomTabNavigator();

export default function HomeScreen({ navigation, route }) {
  const {colorTheme, toggleTheme} = useThemeProvider()

  navigation.setOptions({
    headerTitle: getHeaderTitle(route),
    headerRight: () => (
        <HeaderButtons HeaderButtonComponent={ToolbarButton}>
            <Item key="option-darkmode" iconName="brightness-6" title={"Dunkelmodus toggeln"} onPress={toggleTheme} />
        </HeaderButtons>
    )
})
  return (
    <BottomTab.Navigator
      initialRouteName="Events"
      tabBarOptions={{
        style:{
          backgroundColor: colorTheme.componentBackground
        },
        inactiveTintColor: ConstantColors.grey,
        activeTintColor: colorTheme.secondary,
      }}>
      <BottomTab.Screen
        name="Measures"
        component={MeasureScreen}
        options={{
          tabBarLabel: 'Maßnahmen',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="book-open-outline" />,
        }}
      />
      <BottomTab.Screen
        name="Events"
        component={EventScreen}
        options={{
          tabBarLabel: 'Veranstaltungen',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="calendar" />,
        }}
      />
      <BottomTab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          tabBarLabel: 'Kontakt',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="contact-mail-outline" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name;

  switch (routeName) {
    case 'Measures':
      return 'Maßnahmenübersicht';
    case 'Events':
      return 'Smartfarmcheck';
    case 'Contact':
      return "Kontakt";
    default:
      return "SmartFarmCheck";
  }
}
