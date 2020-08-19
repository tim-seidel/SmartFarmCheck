import React from 'react'
import { SafeAreaView } from 'react-native'
import { useThemeProvider } from '../ThemeContext'

const RootView = (props) => {
    const { colorTheme } = useThemeProvider()

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colorTheme.background, ...props.style }}>
            {props.children}
        </SafeAreaView>
    )
}

export default RootView
