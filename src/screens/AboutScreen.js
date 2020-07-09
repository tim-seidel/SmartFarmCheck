import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Dimensions, View, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import IconButton from '../components/IconButton';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

const Sponsor = props => {
  return (<View style={styles.sponsor}>
    <Image style={styles.image} source={props.localPath}></Image>
    <IconButton type="outline" icon="web" text={props.name} onPress={props.onPress} align="center"></IconButton>
  </View>)
}

const onSponsorPressedHandler = (url) => {
  Linking.openURL(url)
}

const isPortrait = () => {
  const dim = Dimensions.get('screen');
  return dim.height >= dim.width;
};

export default function AboutScreen({ navigation }) {
  const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape')

  useEffect(() => {
    const callback = () => setOrientation(isPortrait() ? 'portrait' : 'landscape');

    Dimensions.addEventListener('change', callback);

    return () => {
      Dimensions.removeEventListener('change', callback);
    };
  }, []);


  var buttonLayout = null
  if (orientation === 'landscape') {
    buttonLayout = (
      <View style={{flexDirection: 'row', margin: 4}}>
        <View style={{flex: 1, marginEnd: 2}}>
          <IconButton icon="information-variant" text="Impressum" onPress={() => { navigation.navigate("Imprint") }} />
        </View>
        <View style={{ flex: 1, marginHorizontal: 2}}>
      <IconButton icon="contact-mail" text="Kontaktieren Sie uns" onPress={() => { navigation.navigate("Contact") }} />
    </View>
        <View style={{flex: 1, marginStart: 2}}>
          <IconButton icon="lock" text="Datenschutz" onPress={() => { navigation.navigate("Privacy") }} />
        </View>
      </View>)
  } else {
   buttonLayout =  (<><View style={{ marginHorizontal: 4, marginTop: 4, marginBottom: 2}}>
      <IconButton icon="contact-mail" text="Kontaktieren Sie uns" onPress={() => { navigation.navigate("Contact") }} />
    </View>
      <View style={styles.buttonRow}>
        <View style={{flex: 1, marginLeft: 4, marginTop: 2, marginRight: 2, marginBottom: 4}}>
          <IconButton icon="information-variant" text="Impressum" onPress={() => { navigation.navigate("Imprint") }} />
        </View>
        <View style={{flex: 1, marginLeft: 2, marginTop: 2, marginRight: 4, marginBottom: 4}}>
          <IconButton icon="lock" text="Datenschutz" onPress={() => { navigation.navigate("Privacy") }} />
        </View>
      </View></>)
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} >
        <Sponsor name="Mittelstand 4.0 (Lingen)" onPress={onSponsorPressedHandler.bind(this, "https://kompetenzzentrum-lingen.digital/")} localPath={require("../../assets/images/logo_mittelstand4.png")} />
        <Sponsor name="Mittelstand Digital" onPress={onSponsorPressedHandler.bind(this, "https://www.mittelstand-digital.de")} localPath={require("../../assets/images/logo_mittelstand_digital.png")} />
        <Sponsor name="BM für Wirtschaft und Energie" onPress={onSponsorPressedHandler.bind(this, "https://www.bmwi.de/Navigation/DE/Home/home.html")} localPath={require("../../assets/images/logo_bmwi.png")} />
      </ScrollView>
     {buttonLayout}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    alignItems: "center",
  },
  title: {
    marginTop: 8,
    textAlign: "center"
  },
  sponsor: {
    width: "90%",
    maxWidth: 400,
    overflow: "hidden",
    marginVertical: 8,
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius,
    borderColor: Layout.borderColor,
    borderWidth: Layout.borderWidth,
    padding: 6
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 4
  },
  buttonRow: {
    flexDirection: 'row',
  },
  buttonInRow: {
    margin: 4,
    flex: 1
  },
  button: {
    margin: 4
  }
});
