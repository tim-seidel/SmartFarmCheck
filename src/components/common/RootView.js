import React from 'react'
import { SafeAreaView } from 'react-native'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'

import { darkTheme, lightTheme } from '../../constants/Colors'

/**
 * @summary The default root view that should be used by all screens. Has darkmode support.
 * @param {Object} props The standard react native ui props 
 */
const RootView = (props) => {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colorTheme.background, ...props.style }}>
            {props.children}
        </SafeAreaView>
    )
}

export default RootView
