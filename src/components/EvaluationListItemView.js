import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'

import { HeadingText, ContentText } from './common/Text'
import Separator from "./common/Separator"

import Layout from '../constants/Layout'
import { darkTheme, lightTheme, ConstantColors } from '../constants/Colors'

function EvaluationListItemView(props) {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

    //TODO: Hardcoding lösen
    const threshold_great = 75
    const threshold_good = 50
    const ratingColor = "green"

    const rating = props.rating + "%"
    //<Text style={{ ...styles.rating, color: ratingColor}}>{rating}</Text>

    return (
        <View
            style={{
                ...styles.outerWrapper,
                backgroundColor: colorTheme.componentBackground,
                ...props.style
            }}>
            <TouchableHighlight underlayColor={colorTheme.componentPressed} onPress={props.ratingSelected}>
                <View style={styles.innerWrapper}>
                    <View style={styles.ratingWrapper}>
                        <View style={styles.starRow}>
                            <Icon name="star" size={24} color={ratingColor} />
                            <Icon name="star" size={24} color={props.rating >= threshold_good ? ratingColor : "transparent"} />
                            <Icon name="star" size={24} color={props.rating >= threshold_great ? ratingColor : "transparent"} />
                        </View>
                        <ContentText style={{ ...styles.rating, color: ConstantColors.grey}}>{rating}</ContentText>
                    </View>
                    <Separator style={styles.divider} orientation="vertical" />
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
        padding: 8
    },
    rating: {
        width: 80,
        fontWeight: "bold",
        fontSize: 22,
        textAlign: "center",
        textAlignVertical: "center"
    },
    divider: {
        marginHorizontal: 8
    },
    measureContent: {
        flexDirection: "column",
        flex: 1
    },
    detailIcon: {
        alignSelf: "center"
    },
    ratingWrapper: {
        justifyContent: 'space-between'
    },
    starRow: {
        flexDirection: 'row'
    }
})

export default EvaluationListItemView