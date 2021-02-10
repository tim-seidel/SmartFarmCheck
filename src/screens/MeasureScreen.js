import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Platform, Dimensions, Linking } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'

import * as Device from 'expo-device'
import NetInfo from '@react-native-community/netinfo';

import RootView from '../components/RootView';
import NoContentView from '../components/NoContentView';
import MeasureListView from '../components/MeasureListView';
import MeasureView from '../components/MeasureView';
import IconButton from '../components/IconButton';
import InformationCard, { InformationText } from "../components//InformationCard";
import { HeadingText } from '../components/Text';

import Strings from '../constants/Strings';
import Keys from '../constants/Keys';
import { MEASUREDETAILSCREEN, FORMSELECTSCREEN, VIDEOSCREEN, AUDIOSCREEN } from '../constants/Paths';
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
  const [selectedMeasure, setSelectedMeasure] = useState(undefined)

  useEffect(() => {
    const callback = ({ screen }) => {
      setOrientation(screen.height >= screen.width ? 'portrait' : 'landscape')
    }
    const checkTablet = async () => {
      const type = await Device.getDeviceTypeAsync()
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

  function measureSelectedHandler(measure){
    console.log(measure.name)
    props.navigation.setOptions({title: measure.name ? "Maßnahmendetails: " + measure.name : "Maßnahmenübersicht"})
    setSelectedMeasure(measure)
  }

  function urlClickHandler(url){
    if (url.includes('.mp4') || url.includes('.avi')) {
      props.navigation.navigate(VIDEOSCREEN, url)
    } else if (url.includes('.mp3')) {
      props.navigation.navigate(AUDIOSCREEN, url)
    }
    else {
      Linking.openURL(url)
    }
  }

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
    const informationHeader = <View>
      <InformationCard toggleInformationEnabled toggleStoreKey={Keys.INFORMATION_TOGGLE_MEASURE_SCREEN} style={styles.informationCard}
        title={Strings.measure_information_title}>
        <InformationText>{Strings.measure_information_text} </InformationText>
      </InformationCard>
      <HeadingText large weight="bold" style={styles.heading}>Alle Digitalisierungsmaßnahmen:</HeadingText>
    </View>

    if (isTablet) {

      console.log("THIS IS A TABLET",)

      let measureContent = null;
      if(selectedMeasure){
        measureContent = <MeasureView measure={selectedMeasure} onURLClicked={urlClickHandler}/>
      }else{
        measureContent = <NoContentView icon="gesture-tap" title={"Wählen Sie eine Maßnahme aus der Liste aus, um weitere Informationen anzuzeigen."} />
      }

      contentView =
      <View style={styles.mainColumn}>
        <View style={styles.splitViewRow}>
          <MeasureListView
            columns={1}
            style={styles.measureListSplit}
            measures={measures}
            measureSelected={measureSelectedHandler}
          >
            {informationHeader}
          </MeasureListView>
          <View style={styles.measureViewSplit}>
            {measureContent}
          </View>
        </View>
        <View style={styles.calculateButtonWrapper}>
            <IconButton icon="clipboard-text-outline" text={Strings.measure_navigate_evaluation} align="center" onPress={() => { props.navigation.navigate(FORMSELECTSCREEN) }} />
          </View>
        </View>
    } else {
      console.log("THIS IS A PHONE", Platform.isPad)

      contentView =
        <View>
          <MeasureListView
            columns={orientation === 'landscape' ? 2 : 1}
            style={styles.measureList}
            measures={measures}
            measureSelected={() => { props.navigation.navigate(MEASUREDETAILSCREEN, measure) }}
          >
            {informationHeader}
          </MeasureListView>

          <View style={styles.calculateButtonWrapper}>
            <IconButton icon="clipboard-text-outline" text={Strings.measure_navigate_evaluation} align="center" onPress={() => { props.navigation.navigate(FORMSELECTSCREEN) }} />
          </View>
        </View>
    }
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
  calculateButtonWrapper: {
    marginHorizontal: 8,
    marginTop: 4,
    marginBottom: 8
  },
  calculateButton: {
    justifyContent: "center"
  },
  splitViewRow: {
    flex: 1,
    flexDirection: 'row'
  },
  measureListSplit: {
    flex: 1,
    marginHorizontal: 4,
  },
  measureViewSplit: {
    flex: 2,
    marginHorizontal: 4
  },
  mainColumn:{
    flex: 1,
    flexDirection: 'column'
  }
});

export default MeasureScreen
