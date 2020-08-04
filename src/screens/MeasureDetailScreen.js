import React from 'react';
import { StyleSheet, View } from 'react-native';

import URLInterceptingWebview from '../components/URLInterceptingWebview';
import {ColorTheme} from'../constants/Colors';

export default function MeasureScreen({ route, navigation }) {
  const measure = route.params

  navigation.setOptions({
    title: measure?.name ?? "Maßnahmeninformation"
  })

  const head = '<html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body {font-size: 110%; font-family: Arial;} p{text-align: justify; hyphens: auto; }</style></head>'
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
    <View style={styles.container}>
      <URLInterceptingWebview source={{ html: wrapped }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorTheme.current.background
  }
});

