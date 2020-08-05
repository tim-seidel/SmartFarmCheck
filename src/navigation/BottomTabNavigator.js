
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import EventScreen from '../screens/EventScreen';
import MeasureScreen from '../screens/MeasureScreen';
import ContactScreen from "../screens/ContactScreen"
import { useStateValue } from '../StateProvider';
import { ConstantColors } from '../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import SFCHeaderButton from './SFCHeaderButton';

const BottomTab = createBottomTabNavigator();

const TabBarIcon = (props) => {
  const [{colorTheme}] = useStateValue()

  return (
    <Icon
      name={props.name}
      size={24}
      color={props.focused ? colorTheme.primary : colorTheme.textSecondary}
    />
  );
}

export default function BottomTabNavigator({ navigation, route }) {
  const [{colorTheme}, dispatch] = useStateValue()

  navigation.setOptions({
    headerTitle: getHeaderTitle(route),
    headerRight: () => (
        <HeaderButtons HeaderButtonComponent={SFCHeaderButton}>
            <Item key="option-darkmode" iconName="brightness-6" title={"Dunkelmodus toggeln"} onPress={() => dispatch({type: 'toggleTheme'})} />
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
        inactiveTintColor: ConstantColors.lightgrey,
        activeTintColor: colorTheme.secondary,
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
