import React from 'react'
import { StyleSheet, View, Linking } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import RootView from '../components/common/RootView'
import SponsorView from '../components/SponsorView'
import IconButton from '../components/common/IconButton'
import { HeadingText } from '../components/common/Text'

import { IMPRINTSCREEN, PRIVACYSCREEN } from '../constants/Paths'
import Strings from '../constants/Strings'

const onSponsorPressedHandler = (url) => {
  Linking.openURL(url)
}

export default function AboutScreen({ navigation }) {
  return (
    <RootView thin>
      <ScrollView style={styles.scroll} >
        <HeadingText large weight="bold" style={styles.title}>Gefördert durch:</HeadingText>
        <SponsorView style={styles.sponsor} name={Strings.imprint_mittelstand_4} onPress={onSponsorPressedHandler.bind(this, "https://kompetenzzentrum-lingen.digital/")} localPath={require("../../assets/images/logos/logo_mkl_1024px_300ppi.png")} />
        <SponsorView style={styles.sponsor} name={Strings.imprint_mittelstand_digital} onPress={onSponsorPressedHandler.bind(this, "https://www.mittelstand-digital.de")} localPath={require("../../assets/images/logos/logo_mittelstand_digital.png")} />
        <SponsorView style={styles.sponsor} name={Strings.imprint_bmwi} onPress={onSponsorPressedHandler.bind(this, "https://www.bmwi.de/Navigation/DE/Home/home.html")} localPath={require("../../assets/images/logos/logo_bmwi.png")} />
      </ScrollView>
      <View style={styles.buttonRow}>
        <View style={{ flex: 1, marginLeft: 8, marginRight: 4, marginBottom: 8 }}>
          <IconButton icon="information-variant" text={Strings.imprint} onPress={() => { navigation.navigate(IMPRINTSCREEN) }} />
        </View>
        <View style={{ flex: 1, marginLeft: 4, marginRight: 8, marginBottom: 8 }}>
          <IconButton icon="lock" text={Strings.privacy} onPress={() => { navigation.navigate(PRIVACYSCREEN) }} />
        </View>
      </View>
    </RootView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    marginBottom: 8,
    marginHorizontal: 8
  },
  title: {
    marginTop: 8,
  },
  sponsor: {
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row'
  }
})
