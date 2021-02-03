
import React, {useEffect} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import EventScreen from './EventScreen'
import MeasureScreen from './MeasureScreen'
import ContactScreen from "./ContactScreen"
import MediaLibraryScreen from "./MediaLibraryScreen"

import { useThemeProvider } from '../ThemeContext'
import { ConstantColors } from '../constants/Colors'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import ToolbarButton from '../components/ToolbarButton'
import TabBarIcon from '../components/TabBarIcon'
import { SETTINGSSCREEN, EVENTSCREEN, MEASURESCREEN, CONTACTSCREEN, MEDIALIBRARYSCREEN} from '../constants/Paths'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

const BottomTab = createBottomTabNavigator()

export default function HomeScreen({ navigation, route }) {
  const { colorTheme } = useThemeProvider()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: getHeaderTitle(route),
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={ToolbarButton}>
          <Item key="option-settings" iconName="more" title={"Einstellungen"} onPress={() => navigation.navigate(SETTINGSSCREEN)} />
        </HeaderButtons>
      )
    })
  }, [navigation, route])

  
  
  return (
    <BottomTab.Navigator
      initialRouteName={EVENTSCREEN}
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
          tabBarLabel: 'Angebote',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="calendar" />,
        }}
      />
       <BottomTab.Screen
        name={MEDIALIBRARYSCREEN}
        component={MediaLibraryScreen}
        options={{
          tabBarLabel: 'Mediathek',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="video" />,
        }}
      />
      <BottomTab.Screen
        name={CONTACTSCREEN}
        component={ContactScreen}
        options={{
          tabBarLabel: 'Kontakt',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="card-account-mail-outline" />,
        }}
      />
    </BottomTab.Navigator>
  )
}

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'SmartFarmCheck';


  switch (routeName) {
    case MEASURESCREEN:
      return 'Maßnahmenübersicht'
    case EVENTSCREEN:
      return 'SmartFarmCheck'
    case MEDIALIBRARYSCREEN: 
      return 'Mediathek'
    case CONTACTSCREEN:
      return "Kontakt"
    default:
      return "SmartFarmCheck"
  }
}
