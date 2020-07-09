import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import NoContentView from '../components/NoContentView';
import MeasureListItemView from '../components/MeasureListItemView';
import IconButton from '../components/IconButton';

import Colors from '../constants/Colors';
import Strings from '../constants/Strings';
import Separator from '../components/Separator';

const MeasureScreen = props => {
  const [measureState, setMeasureState] = useState({ isLoaded: false, error: null, errorCode: 0, measures: [] })

  useEffect(() => {
    if (!measureState.isLoaded) {
      loadMeasures();
    }
  }, [measureState.isLoaded])

  function loadMeasures() {
    if (!measureState.isLoaded) {
      fetch('https://pas.coala.digital/v1/measures', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
      })
        .then(response => response.json())
        .then(json => {
          //Check for request errors
          if(json.status && json.status != 200){
            setMeasureState({isLoaded: true, error: json, errorCode: json.status ?? -1, measures: []})
          }else{
            //Otherwise asumed as correct (A valid server response doesn't return a 200, sadly)
            setMeasureState({ isLoaded: true, error: null, errorCode: 0, measures: json })
          }
          
        })
        .catch(error => {
          console.log("Error", error)
          setMeasureState({ isLoaded: true, error: error, errorCode: -1, measures: []})
        })
    }
  }

  function retryHandler() {
    setMeasureState({ isLoaded: false, error: false, errorCode: 0, measures: [] })
  }

  const { error, errorCode, isLoaded, measures } = measureState;
  if (error) {
    return <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.measure_loading_error + "(Fehlercode: " + errorCode + ")"}></NoContentView>
  } else if (!isLoaded) {
    return <NoContentView icon="cloud-download" loading title={Strings.measure_loading}></NoContentView>
  } else if (measures.length === 0) {
    return <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.measure_loading_empty}></NoContentView>
  } else {
    return (
      <View style={styles.container} >
        <FlatList
          data={measures}
          ItemSeparatorComponent={Separator}
          renderItem={({ item }) => (
            <MeasureListItemView
              key={item.uuid}
              title={item.name}
              short={item.excerpt}
              measureSelected={() => { props.navigation.navigate("MeasureDetail", item) }}
            />
          )}
          keyExtractor={item => item.uuid}
        />
        <View style={styles.calculateButtonWrapper}>
          <IconButton icon="clipboard-text-outline" text={Strings.measure_navigate_evaluation} align="center" onPress={() => { props.navigation.navigate("Form") }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 8
  },
  calculateButtonWrapper: {
    margin: 4,
  },
  calculateButton: {
    justifyContent: "center",
    backgroundColor: Colors.primary
  }
});

export default MeasureScreen
