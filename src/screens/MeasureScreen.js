import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import NoContentView from '../components/NoContentView';
import MeasureListItemView from '../components/MeasureListItemView';
import IconButton from '../components/IconButton';

import Colors from '../constants/Colors';

class MeasureScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      measures: []
    }
  }

  componentDidMount() {
    this.loadMeasures();
  }

  loadMeasures() {
    if (!this.state.isLoaded) {
      fetch('https://pas.coala.digital/v1/measures', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
      })
        .then(response => response.json())
        .then(json => {
          this.setState({
            isLoaded: true,
            measures: json,
            error: null
          })
        })
        .catch(error => {
          console.log("Error", error)
          this.setState({
            isLoaded: false,
            error: error
          })
        })
    }
  }

  onRetryHandler() {
    this.setState({
      isLoaded: false,
      error: null
    }, this.loadMeasures.bind(this))
  }

  render() {
    const navigation = this.props.navigation;
    const { error, isLoaded, measures } = this.state;

    if (error) {
      return <NoContentView icon="emoticon-sad-outline" onRetry={this.onRetryHandler.bind(this)} title="Aktuell können die Maßnahmen geladen werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut."></NoContentView>
    } else if (!isLoaded) {
      return <NoContentView icon="cloud-download" loading title="Laden der aktuellsten Maßnahmen..."></NoContentView>
    } else if (measures.length === 0) {
      return <NoContentView icon="emoticon-sad-outline" onRetry={this.onRetryHandler.bind(this)} title="Aktuell konnten keine Maßnahmen gefunden werden. Bitte überprüfen Sie Ihre Internetverbindung oder versuchen Sie es später erneut."></NoContentView>
    } else {
      return (
        <View style={styles.container} >
          <FlatList
            data={measures}
            renderItem={({ item }) => (
              <MeasureListItemView
                key={item.uuid}
                title={item.name}
                short={item.excerpt}
                measureSelected={() => { navigation.navigate("MeasureDetail", item) }}
              />
            )}
            keyExtractor={item => item.uuid}
          />
          <View style={styles.calculateButtonWrapper}>
            <IconButton icon="clipboard-text-outline" text=" Jetzt Empfehlungen berechnen" align="center" onPress={() => { navigation.navigate("Form") }} />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calculateButtonWrapper: {
    margin: 4,
  },
  calculateButton: {
    justifyContent: "center",
    backgroundColor: Colors.primary
  }
});

// Wrap for navigation
export default function (props) {
  const navigation = useNavigation();

  return <MeasureScreen {...props} navigation={navigation} />;
}
