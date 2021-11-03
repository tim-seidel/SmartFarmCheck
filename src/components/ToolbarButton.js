import React from 'react'
import { HeaderButton } from 'react-navigation-header-buttons'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'

import { darkTheme, lightTheme } from '../constants/Colors'

/**
 * @summary A toolbar button wrapper that supports dark/light mode.
 * @param {Object} props The standard react native ui props.
 */
const ToolbarButton = (props) => {
	const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

	return (
		<HeaderButton
			{...props}
			IconComponent={Icon}
			iconSize={24}
			color={colorTheme.textPrimaryContrast} />
	)
}

export default ToolbarButton
