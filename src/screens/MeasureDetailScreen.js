import React from 'react';
import { StyleSheet, View, Linking } from 'react-native';

import URLInterceptingWebview from '../components/URLInterceptingWebview';
import { useThemeProvider } from '../ThemeContext';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import ToolbarButton from '../components/ToolbarButton';
import { ConstantColors } from '../constants/Colors';

export default function MeasureScreen({ route, navigation }) {
  const { colorTheme, toggleTheme } = useThemeProvider()
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

  navigation.setOptions({
    title: measure?.name ?? "Maßnahmeninformation",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={ToolbarButton}>
        <Item key="option-darkmode" iconName="brightness-6" title={"Dunkelmodus toggeln"} onPress={toggleTheme} />
      </HeaderButtons>
    )
  })

  const head = '<html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body {font-size: 110%; font-family: Arial; color: ' + colorTheme.textPrimary + ' } p{text-align: justify; hyphens: auto; }</style></head>'
  var content = measure.description ?? "<p>Leider wurde noch kein detaillierter Inhalt hinterlegt.</>"

  measure.resources.forEach(r => {
    switch (r.mime) {
      case "image/jpeg":
      case "image/png":
        const uri = "https://pas.coala.digital/v1/measures/" + measure.uuid + "/resource/" + r.name
        content += "<img style=\"max-width: 100%\" src=\"" + uri + "\"/>" + "<p>Bild: " + r.description + "</>"
    }
  });
  const wrapped = head + '<body>' + content + '</body></html>'

  return (
    <View style={{ ...styles.container, backgroundColor: colorTheme.background}}>
      <URLInterceptingWebview style={{ backgroundColor: ConstantColors.transparent }} onURLSelected={onURLHandler} source={{ html: wrapped }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
