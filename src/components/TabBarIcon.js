import React from 'react'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'

import { darkTheme, lightTheme } from '../constants/Colors'

const TabBarIcon = (props) => {
  const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

  return (
	<Icon
	  name={props.name}
	  size={24}
	  color={props.focused ? colorTheme.primary : colorTheme.textHint}
	/>
  )
}

export default TabBarIcon
