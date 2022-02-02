import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'

import { HeadingText, ContentText } from './common/Text'
import Separator from "./common/Separator"

import Layout from '../constants/Layout'
import { darkTheme, lightTheme, ConstantColors } from '../constants/Colors'
import { getRatingLevel, RatingLevels } from '../constants/RatingLevels'

function EvaluationListItemView(props) {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

    const debug = props.debug

    const ratingPercent = props.rating + "%"
    const ratingLevel = getRatingLevel(props.rating)

    const star_2nd = ratingLevel === RatingLevels.star_1_5 ? <Icon name="star-half-full" size={24} color={ConstantColors.rating} /> : ratingLevel >= RatingLevels.star_2 ? <Icon name="star" size={24} color={ConstantColors.rating} /> : <Icon name="star-outline" size={24} color={ConstantColors.rating} />
    const star_3nd = ratingLevel === RatingLevels.star_2_5 ? <Icon name="star-half-full" size={24} color={ConstantColors.rating} /> : ratingLevel >= RatingLevels.star_3 ? <Icon name="star" size={24} color={ConstantColors.rating} /> : <Icon name="star-outline" size={24} color={ConstantColors.rating} />

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
                            <View style={styles.percentWrapper}>
                                <HeadingText large weight="bold">{ratingPercent}</HeadingText>
                                <ContentText small light>Übereinst.</ContentText>
                            </View>
                        </View>
                        <Separator style={styles.divider} orientation="vertical" />
                        <View style={styles.measureContent}>
                            <HeadingText large weight="bold">{props.title}</HeadingText>
                            <ContentText light numberOfLines={3} style={styles.short}>{props.short}</ContentText>
                        </View>
                        <Icon style={{ ...styles.detailIcon, color: colorTheme.textPrimary }} name="chevron-right-circle-outline" size={24} />
                    </View>
                    <Separator />
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
    percentWrapper: {
        alignItems: "center"
    },
    divider: {
        marginHorizontal: 8
    },
    measureContent: {
        flexDirection: "column",
        flex: 1
    },
    short: {
        marginTop: 4
    },
    detailIcon: {
        alignSelf: "center"
    },
    ratingWrapper: {
        justifyContent: 'space-between',
    },
    starRow: {
        flexDirection: 'row'
    },
    debug: {
        paddingHorizontal: 8,
        paddingVertical: 4
    }
})

export default EvaluationListItemView