import 'react-native-gesture-handler'
import React, { useState } from 'react'
import { SplashScreen } from 'expo'
import { Appearance } from 'react-native-appearance'

import { lightTheme, darkTheme } from './src/constants/Colors'
import { ThemeContext } from './src/ThemeContext'
import Content from './src/components/Content'
import AsyncStorage from '@react-native-community/async-storage'
import Keys from './src/constants/Keys'

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false)
  const [themeState, setThemeState] = useState({
    colorTheme: Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme,
    toggleTheme: () => {
      setThemeState(state => ({
        colorTheme: state.colorTheme === darkTheme ? lightTheme : darkTheme,
        toggleTheme: state.toggleTheme
      }))
    }
  })

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide()
        /* Additional loading should be put here.*/

        AsyncStorage.getItem(Keys.SETTING_DARKMODE, (error, value) => {
          if (!error && value !== null) {
            setThemeState(prev => ({
              colorTheme: JSON.parse(value) ? darkTheme : lightTheme,
              toggleTheme: prev.toggleTheme
            }))
          } else {
            AsyncStorage.setItem(Keys.SETTING_DARKMODE, JSON.stringify(themeState.colorTheme === darkTheme))
          }
        })
      } catch (e) {
        console.warn(e)
      } finally {
        setLoadingComplete(true)
        SplashScreen.hide()
      }
    }
    loadResourcesAndDataAsync()
  }, [])

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null /* Handled by splash screen. */
  } else {
    return (
      <ThemeContext.Provider value={themeState}>
        <Content />
      </ThemeContext.Provider>
    )
  }
}
