import React from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'

import { ConstantColors } from '../../constants/Colors'

/**
 * @summary A simple separation view
 * @description The default orientation is horizontal.
 * You can change it with the 'orientation' prop.
 * @param {Object} props The standard react native ui props.
 */
const Separator = props => {
    return <View style= {[props.orientation === 'vertical' ? styles.separatorVertical : styles.separatorHorizontal, props.style]} />
}

Separator.propTypes = {
    orientation: PropTypes.oneOf(['horizontal', 'vertical', 'default'])
}

Separator.defaultProps = {
    orientation: 'default'
}

const styles = StyleSheet.create({
    separatorHorizontal: {
        height: 1,
        backgroundColor: ConstantColors.grey,
    },
    separatorVertical: {
        width: 1,
        backgroundColor: ConstantColors.grey,
    }
})

export default Separator
