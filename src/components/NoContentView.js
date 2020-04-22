import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable'
import IconButton from './IconButton';

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
      {props.onRetry && (<IconButton icon="reload" onPress={props.onRetry} text="Erneut versuchen"></IconButton>)}
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