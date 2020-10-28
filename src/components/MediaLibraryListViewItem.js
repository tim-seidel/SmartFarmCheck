import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { ContentText, HeadingText } from './Text'
import { useThemeProvider } from '../ThemeContext'
import IconButton from './IconButton'
import Layout from '../constants/Layout'
import Strings from '../constants/Strings'

const MediaLibraryListViewItem = (props) => {
    const { colorTheme } = useThemeProvider()

    return (
        <View style={{ ...styles.border, backgroundColor: colorTheme.componentBackground }}>
            <View style={{ ...styles.title, backgroundColor: colorTheme.primary }}>
                <Icon style={styles.titleIcon} name="video" color={colorTheme.textPrimaryContrast} size={24}></Icon>
                <HeadingText style={{ color: colorTheme.textPrimaryContrast }}>{props.title}</HeadingText>
            </View>
            <View style={styles.description}>
                <ContentText light numberOfLines={3}>{props.description}</ContentText>
            </View>
            <View style={styles.imageWrapper}>
                <Image source={require("../../assets/images/logo_mittelstand4.png")} style={styles.image} resizeMode="contain" />

            </View>
            <View style={styles.action}>
                <IconButton icon="video" text={Strings.medialibrary_watch_now} onPress={props.onShowVideo} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    border: {
        borderRadius: Layout.borderRadius,
        borderColor: Layout.borderColor,
        borderWidth: Layout.borderWidth,
        overflow: "hidden",
        marginVertical: 4
    },
    title: {
        borderBottomColor: Layout.borderColor,
        borderBottomWidth: Layout.borderWidth,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: "row"
    },
    titleIcon: {
        marginEnd: 4,
    },
    description: {
        paddingHorizontal: 8,
        paddingTop: 4
    },
    image: {
        width: "100%",
        height: 100,
        backgroundColor: "white",
    },
    imageWrapper: {
        margin: 8,
        borderRadius: Layout.borderRadius,
        overflow: "hidden"
    },
    action: {
        marginBottom: 8,
        marginHorizontal: 8
    }
})

export default MediaLibraryListViewItem
