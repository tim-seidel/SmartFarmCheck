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
                            <ContentText style={{ ...styles.rating, color: ConstantColors.grey }}>{ratingPercent}</ContentText>
                        </View>
                        <Separator style={styles.divider} orientation="vertical" />
                        <View style={styles.measureContent}>
                            <HeadingText large weight="bold">{props.title}</HeadingText>
                            <ContentText light numberOfLines={3} style={{ marginVertical: 4 }}>{props.short}</ContentText>
                        </View>
                        <Icon style={{ ...styles.detailIcon, color: colorTheme.textPrimary }} name="chevron-right" size={32} />
                    </View>
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
    }
})

export default EvaluationListItemView