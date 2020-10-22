import React from 'react'
import { StyleSheet, FlatList, Image } from 'react-native'

import { ContentText, HeadingText } from '../components/Text'
import RootView from '../components/RootView'
import { View } from 'react-native-animatable'
import Layout from '../constants/Layout'
import { useThemeProvider } from '../ThemeContext'
import IconButton from '../components/IconButton'
import { VIDEOSCREEN } from '../constants/Paths'

const videos = [
    {
        uuid: "1",
        title: "Video 1",
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
    },
    {
        uuid: "2",
        title: "Video 2",
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
    },
    {
        uuid: "3",
        title: "Video 3",
        description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        url: "http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
    }
]

const MediaLibraryListViewItem = (props) => {
    const { colorTheme } = useThemeProvider()

    return (
        <View style={{ ...styles.border, backgroundColor: colorTheme.componentBackground }}>
            <View style={{ ...styles.title, backgroundColor: colorTheme.primary }}>
                <HeadingText style={{ color: colorTheme.textPrimaryContrast }}>{props.title}</HeadingText>
            </View>
            <View style={styles.description}>
                <ContentText light numberOfLines={3}>{props.description}</ContentText>
            </View>
            <View style={styles.imageWrapper}>
                <Image source={require("../../assets/images/logo_mittelstand4.png")} style={styles.image} resizeMode="contain" />

            </View>
            <View style={styles.action}>
                <IconButton icon="video" text="Jetzt ansehen" onPress={props.onShowVideo} />
            </View>

        </View>
    )
}

const MediaLibraryScreen = (props) => {

    const showVideoHandler = (url) => {
        props.navigation.navigate(VIDEOSCREEN, url)
    }

    return (
        <RootView>
            <FlatList
                style={styles.list}
                data={videos}
                renderItem={({ item }) => (
                    <MediaLibraryListViewItem
                        title={item.title}
                        description={item.description}
                        onShowVideo={() => showVideoHandler(item.url)}
                    />
                )}
                keyExtractor={item => item.uuid}
            />
        </RootView>
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
    },
    description: {
        paddingHorizontal: 8,
        paddingTop: 4
    },
    list: {
        marginHorizontal: 8,
        marginVertical: 4
    },
    image: {
        width: "100%",
        height: 120,
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

export default MediaLibraryScreen
