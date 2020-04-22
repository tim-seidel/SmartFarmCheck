import React from 'react';
import { Image, StyleSheet, Text, View, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import IconButton from '../components/IconButton';

const Sponsor = props => {
  return (<View style={styles.sponsor}>
    <Image style={styles.image} source={props.localPath}></Image>
    <IconButton type="outline" icon="web" text={props.name} onPress={props.onPress} align="center"></IconButton>
  </View>)
}

const onSponsorPressedHandler = (url) => {
  Linking.openURL(url)
}

export default function AboutScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} >
        <Text style={styles.title}>Gefördert durch:</Text>
        <Sponsor name="Mittelstand 4.0 (Lingen)" onPress={onSponsorPressedHandler.bind(this, "https://kompetenzzentrum-lingen.digital/")} localPath={require("../../assets/images/logo_mittelstand4.png")} />
        <Sponsor name="Mittelstand Digital" onPress={onSponsorPressedHandler.bind(this, "https://www.mittelstand-digital.de")} localPath={require("../../assets/images/logo_mittelstand_digital.png")} />
        <Sponsor name="BM für Wirtschaft und Energie" onPress={onSponsorPressedHandler.bind(this, "https://www.bmwi.de/Navigation/DE/Home/home.html")} localPath={require("../../assets/images/logo_bmwi.png")} />
      </ScrollView>
      <IconButton style={styles.navigateButton} icon="contact-mail" text="Kontaktieren Sie uns" onPress={() => { navigation.navigate("Contact") }} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 8,
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center"
  },
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    alignItems: "center",
  },
  sponsor: {
    width: "70%",
    maxWidth: 400,
    marginVertical: 16
  },
  image: {
    margin: 8,
    width: "100%",
    height: 100,
    resizeMode: "contain",
    alignSelf: "center"
  },
  navigateButton: {
    flex: 1
  }
});
