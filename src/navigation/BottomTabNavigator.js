import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import EventScreen from '../screens/EventScreen';
import MeasureScreen from '../screens/MeasureScreen';
import AboutScreen from "../screens/AboutScreen"
import Colors from '../constants/Colors';

const BottomTab = createBottomTabNavigator();

const TabBarIcon = (props) => {
  return (
    <Icon
      name={props.name}
      size={24}
      color={props.focused ? Colors.primary : Colors.greyInactive}
    />
  );
}

export default function BottomTabNavigator({ navigation, route }) {
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  return (
    <BottomTab.Navigator
      initialRouteName="Events"
      tabBarOptions={{
        inactiveTintColor: Colors.greyInactive,
        activeTintColor: Colors.secondary,
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
        name="About"
        component={AboutScreen}
        options={{
          title: 'Kontakt',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="information-outline" />,
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
    case 'About':
      return "Über diese App & Kontakt";
    default:
      return "Smartfarmcheck";

  }
}
