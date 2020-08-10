import React from 'react'
import {  HeaderButton } from 'react-navigation-header-buttons';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';

import { useThemeProvider } from '../ThemeContext';

const SFCHeaderButton = (props) => {
    const {colorTheme} = useThemeProvider()

    return (
        <HeaderButton {...props} IconComponent={Icon} iconSize={24} color={colorTheme.textPrimaryContrast} />
    )
}

export default SFCHeaderButton
