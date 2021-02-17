import 'react-native-gesture-handler'
import React, { useState } from 'react'
import { Appearance } from 'react-native-appearance'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { lightTheme, darkTheme } from './src/constants/Colors'
import { ThemeContext } from './src/ThemeContext'
import Content from './src/components/Content'
import Keys from './src/constants/Keys'

import measureReducer from './src/store/reducers/measures'
import questionsReducer from './src/store/reducers/questions'
import eventReducer from './src/store/reducers/events'
import feedbackReducer from './src/store/reducers/feedback'
import mediaLibraryReducer from './src/store/reducers/mediaLibrary'
import evaluationReducer from './src/store/reducers/evaluation'


const rootReducer = combineReducers({
  measures: measureReducer,
  questions: questionsReducer,
  evaluation: evaluationReducer,
  events: eventReducer,
  feedback: feedbackReducer,
  mediaLibrary: mediaLibraryReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

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
    async function loadWithSplashScreen() {
      try {
        await SplashScreen.preventAutoHideAsync()
        await loadResourcesAndDataAsync()
      } catch (e) {
        console.warn(e)
      } finally {
        setLoadingComplete(true)
        await SplashScreen.hideAsync()
      }
    }
    loadWithSplashScreen()
  }, [])

  async function loadResourcesAndDataAsync() {
    return AsyncStorage.getItem(Keys.SETTING_DARKMODE, (error, value) => {
      if (!error && value != null) {
        setThemeState(prev => ({
          colorTheme: JSON.parse(value) ? darkTheme : lightTheme,
          toggleTheme: prev.toggleTheme
        }))
      } else {
        AsyncStorage.setItem(Keys.SETTING_DARKMODE, JSON.stringify(themeState.colorTheme === darkTheme))
      }
    })
  }

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null /* Handled by splash screen. */
  } else {
    return (
      <ThemeContext.Provider value={themeState}>
        <Provider store={store}>
          <Content />
        </Provider>
      </ThemeContext.Provider>
    )
  }
}
