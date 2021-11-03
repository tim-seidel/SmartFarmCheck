import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'

import { HeadingText, ContentText } from './common/Text'

import Layout from '../constants/Layout'
import { darkTheme, lightTheme } from '../constants/Colors'

const zeroPad = (value, places) => String(value).padStart(places, ' ')

function EvaluationListItemView(props) {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

    const good_threshold = 50

    return (
        <View
            style={{
                ...styles.outerWrapper,
                backgroundColor: colorTheme.componentBackground,
                borderColor: props.rating >= good_threshold ? 'green' : Layout.borderColor,
                ...props.style
            }}>
            <TouchableHighlight underlayColor={colorTheme.componentPressed} onPress={props.ratingSelected}>
                <View style={styles.innerWrapper}>
                    <Text style={{ ...styles.rating, color: props.rating >= good_threshold ? '#4CBB17' : '#FFD000' }}>{zeroPad(props.rating, 2)}%</Text>
                    <View style={{ ...styles.divider, backgroundColor: colorTheme.textPrimary }} />
                    <View style={styles.measureContent}>
                        <HeadingText large weight="bold">{props.title}</HeadingText>
                        <ContentText light numberOfLines={3} style={{ marginVertical: 4 }}>{props.short}</ContentText>
                    </View>
                    <Icon style={{ ...styles.detailIcon, color: colorTheme.textPrimary }} name="chevron-right" size={32} />
                </View>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    outerWrapper: {
        marginBottom: 8,
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
        width: 80,
        fontWeight: "bold",
        fontSize: 28,
        textAlign: "center",
        textAlignVertical: "center"
    },
    divider: {
        width: Layout.borderWidth,
        height: "100%",
        marginHorizontal: 8
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