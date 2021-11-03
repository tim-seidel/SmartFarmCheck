import React from 'react'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import * as Animatable from 'react-native-animatable'
import PropTypes from 'prop-types'

import IconButton from './IconButton'
import { ContentText } from './Text'

import Strings from '../../constants/Strings'
import { darkTheme, lightTheme } from '../../constants/Colors'

/**
 * @summary A basic UI element that can act as a placeholder for no content or loading states.
 * @description It contains the following customizable elements:
 * - text
 * - icon
 * - button (optional)
 * If the state is set to loading, the icon is animated.
 * If onRetry is set, the button appears and acts as retry button.
 * 
 * The following props can be used:
 * - loading: Sets the button animation
 * - icon: mdi icon code for the central icon
 * - title
 * - onRetry: callback, enables the retry button
 * - props.retryTitle: retry button title (only if onRetry has a callback).
 * 
 * Has darkmode support.
 * @param {Object} props The standard react native ui props.
 */
const NoContentView = props => {
  const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

  const { icon, title, loading, onRetry, retryTitle } = props
  const animationDelay = 500
  const iconSize = 64

  const iconUI = loading ?
    <Animatable.Text animation="rotate" iterationDelay={animationDelay} iterationCount="infinite">
      <Icon name={icon} color={colorTheme.textPrimary} size={iconSize} />
    </Animatable.Text> :
    <Icon name={icon} color={colorTheme.textPrimary} size={iconSize} />

  return (
    <View style={{...styles.container, ...props.style}}>
      {iconUI}
      <ContentText large style={styles.textStyle}>{title}</ContentText>
      {onRetry && (<IconButton icon="reload" onPress={onRetry} text={retryTitle} />)}
    </View>
  )
}

NoContentView.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  onRetry: PropTypes.func,
  retryTitle: PropTypes.string
}

NoContentView.defaultProps = {
  loading: false,
  retryTitle: Strings.try_again
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    paddingHorizontal: 8,
    maxWidth: 700,
    alignSelf: 'center'
  },
  textStyle: {
    marginVertical: 8,
    textAlign: 'center'
  }
})

export default NoContentView
