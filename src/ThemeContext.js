import React, { createContext, useContext } from 'react'
import { Appearance } from 'react-native-appearance'

import { darkTheme, lightTheme } from './constants/Colors'

const intialTheme = Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme

export const ThemeContext = createContext({
  colorTheme: intialTheme,
  toggleTheme: () => { console.log("ThemeContext.toggleTheme() has to be defined elsewhere in a state.") }
})

export const useThemeProvider = () => useContext(ThemeContext)
