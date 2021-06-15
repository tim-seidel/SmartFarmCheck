import React from 'react'
import { View, SafeAreaView, StyleSheet } from 'react-native'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'

import { darkTheme, lightTheme } from '../../constants/Colors'

/**
 * @summary The default root view that should be used by all screens. Has darkmode support.
 * @param {Object} props The standard react native ui props 
 */
const RootView = (props) => {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

    return (
        <SafeAreaView style={{ backgroundColor: colorTheme.background, flex: 1 }}>
            <View style={[props.thin ? styles.thin : { flex: 1 }, props.style]}>
                {props.children}
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    thin: {
        flex: 1,
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
    }
})

export default RootView
