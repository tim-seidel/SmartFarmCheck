import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Platform, Dimensions, Linking, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import * as Device from 'expo-device'
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme';

import RootView from '../components/common/RootView';
import NoContentView from '../components/common/NoContentView';
import MeasureListView from '../components/MeasureListView';
import MeasureView from '../components/MeasureView';
import IconButton from '../components/common/IconButton';
import { ContentText, HeadingText } from '../components/common/Text';
import { WrappedIconButton } from '../components/common/IconButton';

import { fetchMeasures } from '../store/actions/measures';
import Strings from '../constants/Strings';
import { MEASUREDETAILSCREEN, FORMSELECTSCREEN, VIDEOSCREEN, AUDIOSCREEN } from '../constants/Paths';
import Layout from '../constants/Layout';
import { darkTheme, lightTheme } from '../constants/Colors';

const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

const MeasureScreen = props => {
  const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

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

  function measureSelectedHandlerSplit(measure) {
    props.navigation.setOptions({ title: measure.name ? "Maßnahmendetails: " + measure.name : "Maßnahmenübersicht" })
    setSelectedMeasure(measure)
  }

  function measureSelectedHandlerList(measure) {
    props.navigation.navigate(MEASUREDETAILSCREEN, measure.uuid)
    setSelectedMeasure(measure)
  }

  function gotoFormSelectHandler() {
    props.navigation.navigate(FORMSELECTSCREEN)
  }

  function urlClickHandler(url) {
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
        console.log(err)
        setErrorCode(err.name === "AbortError" ? 6000 : (err.status ?? -1))
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

  function gotoFormSelectHandler() {
    props.navigation.navigate(FORMSELECTSCREEN)
  }

  const contentHeader =
    <View>
      <View component style={{ ...styles.competence, backgroundColor: colorTheme.componentBackground }}>
        <View component style={styles.competenceColumn}>
          <Icon name="tractor-variant" color={colorTheme.textPrimary} size={36} />
          <View style={styles.checkHeading}>
            <HeadingText large weight="bold">Unser Digitalisierungscheck</HeadingText>
          </View>
        </View>
        <Image source={require("../../assets/images/logo_mkl_1024px_300ppi.png")} style={styles.defaultImage} resizeMode="contain" />
        <ContentText light>Anhand eines Fragebogens erhalten Sie Empfehlungen für Digitalisierungsmaßnahmen, basierend auf der Befragung vieler Betriebe.</ContentText>
        <View style={styles.calculateButtonWrapper}>
          <IconButton type="solid" icon="format-list-checks" text={Strings.measure_navigate_evaluation} align="center" onPress={gotoFormSelectHandler} />
        </View>
      </View>
      <HeadingText large weight="bold" style={styles.listHeading}>Alle Digitalisierungsmaßnahmen:</HeadingText>
    </View>

  var contentView = null
  if (errorCode !== 0) {
    contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.measure_loading_error + " (Fehlercode: " + errorCode + ")"} />
  } else if (isLoading) {
    contentView = <NoContentView icon="cloud-download" loading title={Strings.measure_loading} />
  } else if (hasNoNetwork && measures.length === 0) {
    contentView = <NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.measure_loading_no_network} />
  } else if (measures.length === 0) {
    contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.measure_loading_empty} />
  } else {
    if (isTablet) {
      let measureContent = null;
      if (selectedMeasure) {
        measureContent = <MeasureView measureId={selectedMeasure.uuid} onURLClicked={urlClickHandler} />
      } else {
        measureContent = <NoContentView icon="gesture-tap" title={Strings.measure_split_content_placeholder} />
      }

      contentView =
        <View style={styles.mainColumn}>
          <View style={styles.splitViewRow}>
            <View style={styles.masterColumn}>
              <MeasureListView
                header={contentHeader}
                measures={measures}
                measureSelected={measureSelectedHandlerSplit} />
            </View>
            <View style={styles.detailColumn}>
              {measureContent}
            </View>
          </View>
        </View>
    } else {
      contentView =
        <View style={styles.mainColumn}>
          <MeasureListView
            columns={orientation === 'landscape' ? 2 : 1}
            header={contentHeader}
            measures={measures}
            measureSelected={measureSelectedHandlerList}
          />
        </View>
    }
  }

  return (
    <RootView>
      {contentView}
    </RootView >
  )
}

const styles = StyleSheet.create({
  mainColumn: {
    flex: 1,
    margin: 8
  },
  splitViewRow: {
    flexDirection: 'row',
    flex: 1
  },
  masterColumn: {
    flex: 1,
  },
  detailColumn: {
    flex: 2,
  },
  competence: {
    padding: 8,
    borderColor: Layout.borderColor,
    borderWidth: Layout.borderWidth,
    borderRadius: Layout.borderRadius
  },
  competenceColumn: {
    flexDirection: "row",
    alignItems: "center",
  },
  listHeading: {
    marginTop: 8,
    marginStart: 2
  },
  checkHeading: {
    marginStart: 8,
    flex: 1
  },
  calculateButtonWrapper: {
    marginTop: 8
  },
  defaultImage: {
    width: "100%",
    height: 120,
    alignSelf: 'center',
    resizeMode: "contain",
    backgroundColor: "white",
  },
});

export default MeasureScreen
