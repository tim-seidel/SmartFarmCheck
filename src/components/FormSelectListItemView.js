import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { HeadingText, ContentText } from './common/Text'
import Layout from '../constants/Layout'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import { darkTheme, lightTheme } from '../constants/Colors'

const FormSelectListItemView = (props) => {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

    return (
        <View style={{ ...styles.outerWrapper, backgroundColor: colorTheme.componentBackground, ...props.style }}>
            <TouchableHighlight underlayColor={colorTheme.componentPressed} onPress={props.onSelected}>
                <View style={styles.innerWrapper}>
                    {
                        props.icon ?
                            <Image source={{ uri: props.icon }} style={styles.image} /> :
                            <Image source={require("../../assets/images/icon_mittelstand_192px.png")} style={styles.image} resizeMode="contain" />
                    }
                    <View style={styles.content}>
                        <HeadingText weight="bold">{props.title}</HeadingText>
                        <ContentText light numberOfLines={3} style={{ marginVertical: 4 }}>{props.description}</ContentText>
                    </View>
                    <Icon style={{ ...styles.detailIcon, color: colorTheme.textPrimary }} name="chevron-right" size={32} />
                </View>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    outerWrapper: {
        marginVertical: 4,
        borderRadius: Layout.borderRadius,
        borderColor: Layout.borderColor,
        borderWidth: Layout.borderWidth,
        overflow: "hidden"
    },
    innerWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 8,
        paddingVertical: 12
    },
    content: {
        flexDirection: "column",
        flex: 1
    },
    detailIcon: {
        alignSelf: "center",
    },
    image: {
        width: 64,
        height: 64,
        marginEnd: 8,
        borderRadius: Layout.borderRadius
    }
})

export default FormSelectListItemView
