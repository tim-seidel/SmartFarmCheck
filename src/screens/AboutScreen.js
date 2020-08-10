import React from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import IconButton from '../components/IconButton';
import { HeadingText } from '../components/Text';
import { useThemeProvider } from '../ThemeContext';
import SponsorView from '../components/SponsorView';

const onSponsorPressedHandler = (url) => {
  Linking.openURL(url)
}

export default function AboutScreen({ navigation }) {
  const {colorTheme} = useThemeProvider()
  
  return (
    <View style={{...styles.container, backgroundColor: colorTheme.background}}>
      <ScrollView style={styles.container} >
        <HeadingText large weight="bold" style={styles.title}>Gefördert durch:</HeadingText>
        <SponsorView style={styles.sponsor} name="Mittelstand 4.0 (Lingen)" onPress={onSponsorPressedHandler.bind(this, "https://kompetenzzentrum-lingen.digital/")} localPath={require("../../assets/images/logo_mittelstand4.png")} />
        <SponsorView style={styles.sponsor} name="Mittelstand Digital" onPress={onSponsorPressedHandler.bind(this, "https://www.mittelstand-digital.de")} localPath={require("../../assets/images/logo_mittelstand_digital.png")} />
        <SponsorView style={styles.sponsor} name="BM für Wirtschaft und Energie" onPress={onSponsorPressedHandler.bind(this, "https://www.bmwi.de/Navigation/DE/Home/home.html")} localPath={require("../../assets/images/logo_bmwi.png")} />
      </ScrollView>
      <View style={styles.buttonRow}>
        <View style={{ flex: 1, marginLeft: 4, marginTop: 2, marginRight: 2, marginBottom: 4 }}>
          <IconButton icon="information-variant" text="Impressum" onPress={() => { navigation.navigate("Imprint") }} />
        </View>
        <View style={{ flex: 1, marginLeft: 2, marginTop: 2, marginRight: 4, marginBottom: 4 }}>
          <IconButton icon="lock" text="Datenschutz" onPress={() => { navigation.navigate("Privacy") }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    marginTop: 8,
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center'
  },
  sponsor:{
    width: "90%",
    maxWidth: 500,
    marginVertical: 8,
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: 'row'
  }
});
