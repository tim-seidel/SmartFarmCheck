
import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'

import EventScreen from './EventScreen'
import MeasureScreen from './MeasureScreen'
import ContactScreen from "./ContactScreen"
import MediaLibraryScreen from "./MediaLibraryScreen"
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import { darkTheme, lightTheme } from '../constants/Colors'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import ToolbarButton from '../components/ToolbarButton'
import TabBarIcon from '../components/TabBarIcon'

import { SETTINGSSCREEN, EVENTSCREEN, MEASURESCREEN, CONTACTSCREEN, MEDIALIBRARYSCREEN } from '../constants/Paths'
import Strings from '../constants/Strings'

const BottomTab = createBottomTabNavigator()

export default function HomeScreen({ navigation, route }) {
  const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

  useEffect(() => {
    navigation.setOptions({
      headerTitle: getHeaderTitle(route),
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={ToolbarButton}>
          <Item
            key="option-settings"
            iconName="cog"
            title={Strings.settings}
            onPress={() => navigation.navigate(SETTINGSSCREEN)} />
        </HeaderButtons>
      )
    })
  }, [navigation, route])

  return (
    <BottomTab.Navigator
      initialRouteName={MEASURESCREEN}
      tabBarOptions={{
        style: {
          backgroundColor: colorTheme.componentBackground
        },
        inactiveTintColor: colorTheme.textHint,
        activeTintColor: colorTheme.primary,
        labelStyle: { fontWeight: 'bold', paddingBottom: 2 }
      }}>
      <BottomTab.Screen
        name={EVENTSCREEN}
        component={EventScreen}
        options={{
          tabBarLabel: Strings.screen_title_events,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="calendar" />,
        }}
      />
      <BottomTab.Screen
        name={MEASURESCREEN}
        component={MeasureScreen}
        options={{
          tabBarLabel: Strings.screen_title_measure_list,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="text-box-search-outline" />,
        }}
      />
      <BottomTab.Screen
        name={MEDIALIBRARYSCREEN}
        component={MediaLibraryScreen}
        options={{
          tabBarLabel: Strings.screen_title_media_library,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="video" />,
        }}
      />
      <BottomTab.Screen
        name={CONTACTSCREEN}
        component={ContactScreen}
        options={{
          tabBarLabel: Strings.screen_title_contact,
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="card-account-mail-outline" />,
        }}
      />
    </BottomTab.Navigator>
  )
}

function getHeaderTitle(route) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? Strings.app_title;


  switch (routeName) {
    case MEASURESCREEN:
      return Strings.screen_title_measure_list
    case EVENTSCREEN:
      return Strings.screen_title_events //Because it's the first / home screen
    case MEDIALIBRARYSCREEN:
      return Strings.screen_title_media_library
    case CONTACTSCREEN:
      return Strings.screen_title_contact
    default:
      return Strings.app_title
  }
}
