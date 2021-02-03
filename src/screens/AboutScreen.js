import React from 'react'
import { StyleSheet, View, Linking } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import IconButton from '../components/IconButton'
import { HeadingText } from '../components/Text'
import SponsorView from '../components/SponsorView'
import RootView from '../components/RootView'
import { IMPRINTSCREEN, PRIVACYSCREEN } from '../constants/Paths'

const onSponsorPressedHandler = (url) => {
  Linking.openURL(url)
}

export default function AboutScreen({ navigation }) {
  return (
    <RootView>
      <ScrollView style={styles.scroll} >
        <HeadingText large weight="bold" style={styles.title}>Gefördert durch:</HeadingText>
        <SponsorView style={styles.sponsor} name="Mittelstand 4.0 (Lingen)" onPress={onSponsorPressedHandler.bind(this, "https://kompetenzzentrum-lingen.digital/")} localPath={require("../../assets/images/logo_mittelstand4.png")} />
        <SponsorView style={styles.sponsor} name="Mittelstand Digital" onPress={onSponsorPressedHandler.bind(this, "https://www.mittelstand-digital.de")} localPath={require("../../assets/images/logo_mittelstand_digital.png")} />
        <SponsorView style={styles.sponsor} name="BM für Wirtschaft und Energie" onPress={onSponsorPressedHandler.bind(this, "https://www.bmwi.de/Navigation/DE/Home/home.html")} localPath={require("../../assets/images/logo_bmwi.png")} />
      </ScrollView>
      <View style={styles.buttonRow}>
        <View style={{ flex: 1, marginLeft: 8,  marginRight: 4, marginBottom: 8 }}>
          <IconButton icon="information-variant" text="Impressum" onPress={() => { navigation.navigate(IMPRINTSCREEN) }} />
        </View>
        <View style={{ flex: 1, marginLeft: 4, marginRight: 8, marginBottom: 8 }}>
          <IconButton icon="lock" text="Datenschutz" onPress={() => { navigation.navigate(PRIVACYSCREEN) }} />
        </View>
      </View>
    </RootView>
  )
}

const styles = StyleSheet.create({
  scroll:{
    marginBottom: 8
  },
  title: {
    marginTop: 8,
    width: '90%',
    maxWidth: 500,
    alignSelf: 'center'
  },
  sponsor: {
    width: "90%",
    maxWidth: 500,
    marginVertical: 8,
    alignSelf: 'center',
  },
  buttonRow: {
    flexDirection: 'row'
  }
})
