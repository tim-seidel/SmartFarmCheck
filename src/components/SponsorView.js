import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

import IconButton from '../components/IconButton'
import Layout from '../constants/Layout'
import { ConstantColors } from '../constants/Colors'

const SponsorView = (props) => {
  return (
    <View style={{ ...styles.container, ...props.style }}>
      <Image style={styles.image} source={props.localPath}></Image>
      <View style={styles.buttonWrapper}>
        <IconButton  icon="web" text={props.name} onPress={props.onPress}></IconButton>
      </View>
    </View>)
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ConstantColors.white, //Fixed color for better contrast to the images (e. g. in darkmode)
    overflow: "hidden",
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
  buttonWrapper: {
    marginTop: 8
  }
})

export default SponsorView
