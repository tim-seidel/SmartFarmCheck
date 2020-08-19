import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import * as Device from 'expo-device'
import NetInfo from '@react-native-community/netinfo';

import NoContentView from '../components/NoContentView';
import MeasureListItemView from '../components/MeasureListItemView';
import IconButton from '../components/IconButton';
import InformationCard, { InformationText } from "../components//InformationCard";
import Strings from '../constants/Strings';
import { HeadingText } from '../components/Text';
import Keys from '../constants/Keys';
import RootView from '../components/RootView';

const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

const MeasureScreen = props => {
  const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape')
  const [isTablet, setIsTablet] = useState(Platform.isPad)
  const [measureState, setMeasureState] = useState({ isLoaded: false, hasNetwork: true, error: null, errorCode: 0, measures: [] })

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
      checkAndLoadMeasures();
    }
  }, [measureState.isLoaded])

  function checkAndLoadMeasures() {
    if (!measureState.isLoaded) {

      NetInfo.fetch().then(state => {
        if (state.isConnected) {
          loadMeasures()
        } else {
          setMeasureState({ isLoaded: true, error: null, errorCode: 0, hasNetwork: false, measures: [] })
        }
      });
    }
  }

  function loadMeasures() {
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
          setMeasureState({ isLoaded: true, hasNetowrk: true, error: json, errorCode: json.status ?? -1, measures: [] })
        } else {
          //Otherwise asumed as correct (A valid server response doesn't return a 200, sadly)
          json.sort(function (l, r) {
            if (l.name < r.name) return -1
            else if (l.name > r.name) return 1
            else return 0
          })
          setMeasureState({ isLoaded: true, hasNetwork: true, error: null, errorCode: 0, measures: json })
        }

      })
      .catch(error => {
        console.log("Error", error)
        setMeasureState({ isLoaded: true, hasNetowrk: true, error: error, errorCode: -1, measures: [] })
      })
  }

  function retryHandler() {
    setMeasureState({ isLoaded: false, error: false, errorCode: 0, measures: [] })
  }

  const { error, errorCode, hasNetwork, isLoaded, measures } = measureState;
  var contentView = null
  if (error) {
    contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.measure_loading_error + "(Fehlercode: " + errorCode + ")"} />
  } else if (!isLoaded) {
    contentView = <NoContentView icon="cloud-download" loading title={Strings.measure_loading} />
  } else if (!hasNetwork) {
    contentView = <NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.measure_loading_no_network} />
  } else if (measures.length === 0) {
    contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.measure_loading_empty} />
  } else {
    contentView = (
      <>
        <FlatList
          key={(isTablet && orientation === 'landscape' ? 'l' : 'p')} //Need to change the key aswell, because an on the fly update of numColumns is not supported and a full rerender is necessary
          numColumns={isTablet && orientation === 'landscape' ? 2 : 1}
          style={styles.measureList}
          ListHeaderComponent={
            <View>
              <InformationCard toggleInformationEnabled toggleStoreKey={Keys.INFORMATION_TOGGLE_MEASURE_SCREEN} style={styles.informationCard}
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
          <IconButton icon="clipboard-text-outline" text={Strings.measure_navigate_evaluation} align="center" onPress={() => { props.navigation.navigate("FormSelect") }} />
        </View>
      </>
    )
  }

  return (
    <RootView>
      {contentView}
    </RootView>
  )
}

const styles = StyleSheet.create({
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
