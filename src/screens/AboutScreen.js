import React from 'react';
import { Image, StyleSheet, View, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import IconButton from '../components/IconButton';
import {ColorTheme} from '../constants/Colors';
import Layout from '../constants/Layout';
import { HeadingText } from '../components/Text';

const Sponsor = props => {
  return (
  <View style={styles.sponsor}>
    <Image style={styles.image} source={props.localPath}></Image>
    <View style={styles.buttonWrapper}>
    <IconButton type="outline" icon="web" text={props.name} onPress={props.onPress}></IconButton>
    </View>

  </View>)
}

const onSponsorPressedHandler = (url) => {
  Linking.openURL(url)
}

export default function AboutScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} >
        <HeadingText large weight="bold" style={styles.title}>Gefördert durch:</HeadingText>
        <Sponsor name="Mittelstand 4.0 (Lingen)" onPress={onSponsorPressedHandler.bind(this, "https://kompetenzzentrum-lingen.digital/")} localPath={require("../../assets/images/logo_mittelstand4.png")} />
        <Sponsor name="Mittelstand Digital" onPress={onSponsorPressedHandler.bind(this, "https://www.mittelstand-digital.de")} localPath={require("../../assets/images/logo_mittelstand_digital.png")} />
        <Sponsor name="BM für Wirtschaft und Energie" onPress={onSponsorPressedHandler.bind(this, "https://www.bmwi.de/Navigation/DE/Home/home.html")} localPath={require("../../assets/images/logo_bmwi.png")} />
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
    flex: 1,
    backgroundColor: ColorTheme.current.background
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
    overflow: "hidden",
    marginVertical: 8,
    alignSelf: 'center',
    backgroundColor: ColorTheme.current.background,
    borderRadius: Layout.borderRadius,
    borderColor: Layout.borderColor,
    borderWidth: Layout.borderWidth,
    padding: 8
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    alignSelf: "center"
  },
  buttonRow: {
    flexDirection: 'row'
  },
  buttonWrapper:{
    marginTop: 8
  }
});
