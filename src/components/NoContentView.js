import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable'
import IconButton from './IconButton';
import Strings from '../constants/Strings';

/*
 * A basic view that can be used if no content is available.
 * Consists of: 
 *  - Icon (can be set as spinning to display a progress or loading state.)
 *  - Text 
 *  - Button (can be turned off or on and e.g. be used as a retry button.)
 */

const NoContentView = props => {
  const icon = !props.loading ?
    (<Icon name={props.icon} size={64}></Icon>) :
    (<Animatable.Text animation="rotate" iterationDelay={500} iterationCount="infinite">
      <Icon name={props.icon} size={64}></Icon>
    </Animatable.Text>)

  return (
    <View style={styles.containerStyle}>
      {icon}
      <Text style={styles.textStyle}>{props.title}</Text>
      {props.onRetry && (<IconButton icon="reload" onPress={props.onRetry} text={Strings.try_again}></IconButton>)}
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    paddingHorizontal: 8,
    maxWidth: 600,
    alignSelf: 'center'
  },
  textStyle: {
    marginVertical: 8,
    textAlign: 'center',
    fontSize: 18
  }
});

export default NoContentView;