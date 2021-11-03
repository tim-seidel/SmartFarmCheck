import React from 'react'
import { View as ReactView } from 'react-native'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'

import { ConstantColors, darkTheme, lightTheme } from '../../constants/Colors'

/**
 * @summary A wrapper for the standard view class, that supports light&dark mode.
 * @param {Object} props The standard react native ui props 
 */
const View = (props) => {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme
    const {component, background} = props
    return (
        <ReactView style={{ backgroundColor: component ? colorTheme.componentBackground : background ? colorTheme.background : ConstantColors.transparent, ...props.style }}>
            {props.children}
        </ReactView>
    )
}

export default View
