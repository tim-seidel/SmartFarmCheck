
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import EventScreen from '../screens/EventScreen';
import MeasureScreen from '../screens/MeasureScreen';
import ContactScreen from "../screens/ContactScreen"
import {ColorTheme} from'../constants/Colors';

const BottomTab = createBottomTabNavigator();

const TabBarIcon = (props) => {
  return (
    <Icon
      name={props.name}
      size={24}
      color={props.focused ? ColorTheme.current.primary : ColorTheme.current.textSecondary}
    />
  );
}

export default function BottomTabNavigator({ navigation, route }) {
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  return (
    <BottomTab.Navigator
      initialRouteName="Events"
      tabBarOptions={{
        style:{
          backgroundColor: ColorTheme.current.componentBackground
        },
        inactiveTintColor: ColorTheme.current.grey,
        activeTintColor: ColorTheme.current.secondary,
      }}>
      <BottomTab.Screen
        name="Measures"
        component={MeasureScreen}
        options={{
          title: 'Maßnahmen',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="book-open-outline" />,
        }}
      />
      <BottomTab.Screen
        name="Events"
        component={EventScreen}
        options={{
          title: 'Veranstaltungen',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="calendar" />,
        }}
      />
      <BottomTab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          title: 'Kontakt',
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
      return "Smartfarmcheck";

  }
}
