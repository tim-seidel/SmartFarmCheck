import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import * as Device from 'expo-device'
import NoContentView from '../components/NoContentView';
import MeasureListItemView from '../components/MeasureListItemView';
import IconButton from '../components/IconButton';
import InformationCard, { InformationText } from "../components//InformationCard";

import { ColorTheme } from '../constants/Colors';
import Strings from '../constants/Strings';
import { HeadingText } from '../components/Text';

const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

const MeasureScreen = props => {
  const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape')
  const [isTablet, setIsTablet] = useState(Platform.isPad)
  const [measureState, setMeasureState] = useState({ isLoaded: false, error: null, errorCode: 0, measures: [] })


  useEffect(() => {
    const callback = () => setOrientation(isPortrait() ? 'portrait' : 'landscape');

    const checkTablet = async () => {
      const type = Device.getDeviceTypeAsync()
      setIsTablet(!(type === Device.DeviceType.PHONE || type === Device.DeviceType.UNKNOWN))
    }

    Dimensions.addEventListener('change', callback);
    checkTablet()

    return () => {
      Dimensions.removeEventListener('change', callback);
    };
  }, []);

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
          if (json.status && json.status != 200) {
            setMeasureState({ isLoaded: true, error: json, errorCode: json.status ?? -1, measures: [] })
          } else {
            //Otherwise asumed as correct (A valid server response doesn't return a 200, sadly)
            json.sort(function (l, r) {
              if (l.name < r.name) return -1
              else if (l.name > r.name) return 1
              else return 0
            })
            setMeasureState({ isLoaded: true, error: null, errorCode: 0, measures: json })
          }

        })
        .catch(error => {
          console.log("Error", error)
          setMeasureState({ isLoaded: true, error: error, errorCode: -1, measures: [] })
        })
    }
  }

  function retryHandler() {
    setMeasureState({ isLoaded: false, error: false, errorCode: 0, measures: [] })
  }

  const { error, errorCode, isLoaded, measures } = measureState;
  if (error) {
    return <View style={styles.container}><NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.measure_loading_error + "(Fehlercode: " + errorCode + ")"}></NoContentView></View>
  } else if (!isLoaded) {
    return <View style={styles.container}><NoContentView icon="cloud-download" loading title={Strings.measure_loading}></NoContentView></View>
  } else if (measures.length === 0) {
    return <View style={styles.container}><NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.measure_loading_empty}></NoContentView></View>
  } else {
    return (
      <View style={styles.container} >
        <FlatList
          key={(isTablet && orientation === 'landscape' ? 'l' : 'p')} //Need to change the key aswell, because an on the fly update of numColumns is not supported and a full rerender is necessary
          numColumns={isTablet && orientation === 'landscape' ? 2 : 1}
          style={styles.measureList}
          ListHeaderComponent={
            <View>
              <InformationCard style={styles.informationCard}
                title={Strings.measure_information_title}>
                <InformationText>{Strings.measure_information_text} </InformationText>
              </InformationCard>
              <HeadingText large weight="bold" style={styles.heading}>Alle Digitalisierungsmaßnahmen:</HeadingText>
            </View>}
          data={measures}
          renderItem={({ item }) => (
            <MeasureListItemView
              style={styles.measureColumn}
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
    backgroundColor: ColorTheme.current.background
  },
  informationCard: {
    marginTop: 8,
    marginHorizontal: 4
  },
  heading: {
    marginTop: 16,
    marginBottom: 8,
    marginStart: 6
  },
  measureList: {
    marginHorizontal: 4,
  },
  measureColumn: {
    flex: 1,
    margin: 4
  },
  calculateButtonWrapper: {
    margin: 8
  },
  calculateButton: {
    justifyContent: "center"
  }
}
);

export default MeasureScreen
