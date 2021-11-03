import 'react-native-gesture-handler'
import React from 'react'
import { StatusBar } from 'react-native'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import * as SplashScreen from 'expo-splash-screen';

import Content from './src/components/Content'

import { lightTheme, darkTheme } from './src/constants/Colors'

import formsReducer from './src/store/reducers/forms'
import measureReducer from './src/store/reducers/measures'
import questionsReducer from './src/store/reducers/questions'
import eventReducer from './src/store/reducers/events'
import mediaLibraryReducer from './src/store/reducers/mediaLibrary'
import evaluationReducer from './src/store/reducers/evaluation'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'

const rootReducer = combineReducers({
  forms: formsReducer,
  measures: measureReducer,
  questions: questionsReducer,
  evaluation: evaluationReducer,
  events: eventReducer,
  mediaLibrary: mediaLibraryReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false)
  const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

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
  }

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null /* Handled by splash screen. */
  } else {
    return (
      <Provider store={store}>
        <Content />
        <StatusBar backgroundColor={colorTheme.secondary} />
      </Provider>
    )
  }
}
