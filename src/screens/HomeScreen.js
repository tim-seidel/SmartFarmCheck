
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import EventScreen from './EventScreen'
import MeasureScreen from './MeasureScreen'
import ContactScreen from "./ContactScreen"
import { useThemeProvider } from '../ThemeContext'
import { ConstantColors } from '../constants/Colors'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import ToolbarButton from '../components/ToolbarButton'
import TabBarIcon from '../components/TabBarIcon'
import { SETTINGSSCREEN, EVENTSCREEN, MEASURESCREEN, CONTACTSCREEN } from '../constants/Paths'

const BottomTab = createBottomTabNavigator()

export default function HomeScreen({ navigation, route }) {
  const { colorTheme } = useThemeProvider()

  navigation.setOptions({
    headerTitle: getHeaderTitle(route),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={ToolbarButton}>
        <Item key="option-settings" iconName="settings" title={"Dunkelmodus toggeln"} onPress={() => navigation.navigate(SETTINGSSCREEN)} />
      </HeaderButtons>
    )
  })
  return (
    <BottomTab.Navigator
      initialRouteName="Events"
      tabBarOptions={{
        style: {
          backgroundColor: colorTheme.componentBackground
        },
        inactiveTintColor: ConstantColors.grey,
        activeTintColor: colorTheme.secondary,
      }}>
      <BottomTab.Screen
        name={MEASURESCREEN}
        component={MeasureScreen}
        options={{
          tabBarLabel: 'Maßnahmen',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="book-open-outline" />,
        }}
      />
      <BottomTab.Screen
        name={EVENTSCREEN}
        component={EventScreen}
        options={{
          tabBarLabel: 'Veranstaltungen',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="calendar" />,
        }}
      />
      <BottomTab.Screen
        name={CONTACTSCREEN}
        component={ContactScreen}
        options={{
          tabBarLabel: 'Kontakt',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="contact-mail-outline" />,
        }}
      />
    </BottomTab.Navigator>
  )
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name

  switch (routeName) {
    case 'Measures':
      return 'Maßnahmenübersicht'
    case 'Events':
      return 'Smartfarmcheck'
    case 'Contact':
      return "Kontakt"
    default:
      return "SmartFarmCheck"
  }
}
