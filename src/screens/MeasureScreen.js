import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
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
import { fetchMeasures } from '../store/actions/measures';

const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

const MeasureScreen = props => {
  const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape')
  const [isTablet, setIsTablet] = useState(Platform.isPad)

  const [isLoading, setIsLoading] = useState(false)
  const [hasNoNetwork, setHasNoNetwork] = useState(false)
  const [errorCode, setErrorCode] = useState(0)

  const dispatch = useDispatch()
  const measures = useSelector(state => state.measures.measures)

  useEffect(() => {
    const callback = ({ screen }) => {
      setOrientation(screen.height >= screen.width ? 'portrait' : 'landscape')
    }
    const checkTablet = async () => {
      const type = Device.getDeviceTypeAsync()
      setIsTablet(!(type === Device.DeviceType.PHONE || type === Device.DeviceType.UNKNOWN))
    }
    checkTablet()

    Dimensions.addEventListener('change', callback);
    return () => {
      Dimensions.removeEventListener('change', callback);
    };
  }, []);

  useEffect(() => {
    checkAndLoadMeasures()
  }, [checkAndLoadMeasures])

  const checkAndLoadMeasures = useCallback(async () => {
    const netinfo = await NetInfo.fetch()
    if (netinfo.isConnected) {
      setIsLoading(true)
      try {
        await dispatch(fetchMeasures())
      } catch (err) {
        setErrorCode(err.status ?? -1)
      }
      setIsLoading(false)
    } else {
      setHasNoNetwork(true)
    }
  }, [dispatch])

  function retryHandler() {
    setErrorCode(0)
    setHasNoNetwork(false)
    checkAndLoadMeasures()
  }

  var contentView = null
  if (errorCode !== 0) {
    contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.measure_loading_error + "(Fehlercode: " + errorCode + ")"} />
  } else if (isLoading) {
    contentView = <NoContentView icon="cloud-download" loading title={Strings.measure_loading} />
  } else if (hasNoNetwork && measures.length === 0) {
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
