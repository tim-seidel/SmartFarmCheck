import React from 'react'
import {  HeaderButton } from 'react-navigation-header-buttons';
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';

import { useStateValue } from '../StateProvider';

const SFCHeaderButton = (props) => {
    const [{colorTheme}] = useStateValue()

    return (
        <HeaderButton {...props} IconComponent={Icon} iconSize={24} color={colorTheme.textPrimaryContrast} />
    )
}

export default SFCHeaderButton
