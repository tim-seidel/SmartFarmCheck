import React from 'react';
import { StyleSheet, View } from 'react-native';

import URLInterceptingWebview from '../components/URLInterceptingWebview';

export default function MeasureScreen({ route, navigation }) {
  const measure = route.params

  navigation.setOptions({
    title: measure?.name ?? "Maßnahmeninformation"
  })

  const head = '<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>'
  const content = measure.description ?? "<p>Leider wurde noch kein detaillierter Inhalt hinterlegt.</>"
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
    backgroundColor: '#fafafa',
  }
});

