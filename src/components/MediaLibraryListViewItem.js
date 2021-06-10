import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { ContentText, HeadingText } from './common/Text'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import { darkTheme, lightTheme } from '../constants/Colors'
import IconButton from './common/IconButton'
import Layout from '../constants/Layout'
import Strings from '../constants/Strings'

const MediaLibraryListViewItem = (props) => {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

    return (
        <View style={{ ...styles.container, backgroundColor: colorTheme.componentBackground, ...props.style }}>
            <View style={styles.upperWrapper}>
                <View style={styles.titleRow}>
                    <Icon style={styles.titleIcon} name="video-outline" size={24} color={colorTheme.textPrimary}></Icon>
                    <HeadingText weight="bold">{props.title}</HeadingText>
                </View>
                <View style={styles.separator}></View>
                <View style={styles.description}>
                    <ContentText light numberOfLines={3}>{props.description ?? "Keine Beschreibung verfügbar."}</ContentText>
                </View>
            </View>
            <View>
                <View style={styles.imageWrapper}>
                    {
                        props.thumbnail ?
                            <Image source={{ uri: props.thumbnail }} style={styles.image} /> :
                            <Image source={require("../../assets/images/logo_mkl_1024px_300ppi.png")} style={styles.defaultImage} resizeMode="contain" />
                    }
                </View>
                <View style={styles.action}>
                    <IconButton icon="video" text={Strings.medialibrary_watch_now} onPress={props.onShowVideo} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: Layout.borderRadius,
        borderColor: Layout.borderColor,
        borderWidth: Layout.borderWidth,
        overflow: "hidden"
    },
    upperWrapper: {
        flex: 1
    },
    titleRow: {
        marginHorizontal: 8,
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
    },
    titleIcon: {
        marginEnd: 4,
    },
    separator: {
        backgroundColor: Layout.borderColor,
        height: Layout.borderWidth,
        marginHorizontal: 8,
        marginVertical: 8,
    },
    description: {
        paddingHorizontal: 8,
    },
    defaultImage: {
        width: "100%",
        height: 120,
        alignSelf: 'center',
        resizeMode: "contain",
        backgroundColor: "white",
    },
    image: {
        width: "100%",
        height: 120,
        alignSelf: 'center',
        borderRadius: Layout.borderRadius,
    },
    imageWrapper: {
        margin: 8,
        padding: 8,
        borderRadius: Layout.borderRadius,
        borderColor: Layout.borderColor,
        borderWidth: Layout.borderWidth,
        overflow: "hidden"
    },
    action: {
        marginBottom: 8,
        marginHorizontal: 8
    }
})

export default MediaLibraryListViewItem
