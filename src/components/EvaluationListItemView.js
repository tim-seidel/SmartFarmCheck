import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { HeadingText, ContentText } from './Text'
import Layout from '../constants/Layout'
import { useThemeProvider } from '../ThemeContext'

const zeroPad = (value, places) => String(value).padStart(places, ' ')

function EvaluationListItemView(props) {
    const { colorTheme } = useThemeProvider()

    return (
        <View style={{ ...styles.outerWrapper, backgroundColor: colorTheme.componentBackground, ...props.style }}>
            <TouchableHighlight underlayColor={colorTheme.componentPressed} onPress={props.ratingSelected}>
                <View style={styles.innerWrapper}>
                    <Text style={styles.rating}>{zeroPad(props.rating, 2)}%</Text>
                    <View style={{ ...styles.divider, backgroundColor: colorTheme.textPrimary }}></View>
                    <View style={styles.measureContent}>
                        <HeadingText large>{props.title}</HeadingText>
                        <ContentText light numberOfLines={3} style={{ marginVertical: 4 }}>{props.short}</ContentText>
                    </View>
                    <Icon style={{ ...styles.detailIcon, color: colorTheme.textPrimary }} name="chevron-right" size={32}></Icon>
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
    rating: {
        fontSize: 28,
        fontWeight: "700",
        color: "green",
        textAlign: "center",
        textAlignVertical: "center",
        marginEnd: 8,
        width: 80
    },
    divider: {
        width: Layout.borderWidth,
        height: "100%",
        marginStart: 4,
        marginEnd: 8
    },
    measureContent: {
        flexDirection: "column",
        flex: 1
    },
    detailIcon: {
        alignSelf: "center"
    }
})

export default EvaluationListItemView