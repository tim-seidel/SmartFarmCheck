import React from 'react'
import { Linking } from 'react-native'

import RootView from '../components/common/RootView'
import MeasureView from '../components/MeasureView'

import { VIDEOSCREEN, AUDIOSCREEN } from '../constants/Paths'

export default function MeasureScreen({ route, navigation }) {
  const measureId = route.params

  function onURLHandler(url) {
	if (url.includes('.mp4') || url.includes('.avi')) {
	  navigation.navigate(VIDEOSCREEN, url)
	} else if (url.includes('.mp3')) {
	  navigation.navigate(AUDIOSCREEN, url)
	}
	else {
	  if (!url) return
	  Linking.canOpenURL(url).then(can => {
		if (can) {
		  Linking.openURL(url)
		}
	  })
	}
  }

  return (
	<RootView>
	  <MeasureView measureId={measureId} onURLClicked={onURLHandler} />
	</RootView>
  )
}
