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

    const debug = props.debug

    const rating = props.rating
    const ratingPercent = props.rating + "%"

    let ratingLevel = 2
    if(rating >= 85) ratingLevel = 6
    else if (rating >= 70) ratingLevel = 5
    else if (rating >= 55) ratingLevel = 4
    else if (rating >= 45) ratingLevel = 3
    else ratingLevel = 2

    const star_2nd = ratingLevel === 3 ? <Icon name="star-half" size={24} color={ConstantColors.rating} /> : ratingLevel >= 4 ? <Icon name="star" size={24} color={ConstantColors.rating} /> : <Icon name="star-outline" size={24} color={ConstantColors.rating} />
    const star_3nd = ratingLevel === 5 ? <Icon name="star-half" size={24} color={ConstantColors.rating} /> : ratingLevel >= 6 ? <Icon name="star" size={24} color={ConstantColors.rating} /> : <Icon name="star-outline" size={24} color={ConstantColors.rating} />

    return (
        <View
            style={{
                ...styles.outerWrapper,
                backgroundColor: colorTheme.componentBackground,
                ...props.style
            }}>
            <TouchableHighlight underlayColor={colorTheme.componentPressed} onPress={props.ratingSelected}>
                <View>
                    <View style={styles.innerWrapper}>
                        <View style={styles.ratingWrapper}>
                            <View style={styles.starRow}>
                                <Icon name="star" size={24} color={ConstantColors.rating} />
                                {star_2nd}
                                {star_3nd}
                            </View>
                            <ContentText style={{ ...styles.rating, color: ConstantColors.grey }}>{ratingPercent}</ContentText>
                        </View>
                        <Separator style={styles.divider} orientation="vertical" />
                        <View style={styles.measureContent}>
                            <HeadingText large weight="bold">{props.title}</HeadingText>
                            <ContentText light numberOfLines={3} style={{ marginVertical: 4 }}>{props.short}</ContentText>
                        </View>
                        <Icon style={{ ...styles.detailIcon, color: colorTheme.textPrimary }} name="chevron-right" size={32} />
                    </View>
                    <Separator/>
                    <ContentText style={styles.debug}>{debug}</ContentText>
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
        marginEnd: 8
    },
    measureContent: {
        flexDirection: "column",
        flex: 1
    },
    detailIcon: {
        alignSelf: "center"
    },
    ratingWrapper: {
        justifyContent: 'space-between',
    },
    starRow: {
        flexDirection: 'row',
        marginEnd: 8
    },
    debug: {
        paddingHorizontal: 8,
        paddingVertical: 4
    }
})

export default EvaluationListItemView