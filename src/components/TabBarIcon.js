import React from 'react'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'

import { useThemeProvider } from '../ThemeContext'
import { ConstantColors } from '../constants/Colors'

const TabBarIcon = (props) => {
  const { colorTheme } = useThemeProvider()

  return (
    <Icon
      name={props.name}
      size={24}
      color={props.focused ? colorTheme.primary : ConstantColors.grey}
    />
  )
}

export default TabBarIcon
