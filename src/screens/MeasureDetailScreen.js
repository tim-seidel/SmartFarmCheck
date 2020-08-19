import React from 'react'
import { Linking} from 'react-native'

import URLInterceptingWebview from '../components/URLInterceptingWebview'
import { useThemeProvider } from '../ThemeContext'
import { ConstantColors } from '../constants/Colors'
import RootView from '../components/RootView'

export default function MeasureScreen({ route, navigation }) {
  const { colorTheme } = useThemeProvider()
  const measure = route.params

  function onURLHandler(url) {
    if (url.includes('.mp4') || url.includes('.avi')) {
      navigation.navigate('Video', url)
    } else if (url.includes('.mp3')) {
      navigation.navigate('Audio', url)
    }
    else {
      Linking.openURL(url)
    }
  }

  const head = '<html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body {font-size: 110%; font-family: Arial; color: ' + colorTheme.textPrimary + ' } p{text-align: justify; hyphens: auto; }</style></head>'
  var content = measure.description ?? "<p>Leider wurde noch kein detaillierter Inhalt hinterlegt.</>"

  measure.resources.forEach(r => {
    switch (r.mime) {
      case "image/jpeg":
      case "image/png":
        const uri = "https://pas.coala.digital/v1/measures/" + measure.uuid + "/resource/" + r.name
        content += "<img style=\"max-width: 100%\" src=\"" + uri + "\"/>" + "<p>Bild: " + r.description + "</>"
    }
  })
  const wrapped = head + '<body>' + content + '</body></html>'

  return (
    <RootView>
      <URLInterceptingWebview style={{ backgroundColor: ConstantColors.transparent }} onURLSelected={onURLHandler} source={{ html: wrapped }} />
    </RootView>
  )
}
