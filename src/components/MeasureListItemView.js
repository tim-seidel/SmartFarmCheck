import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { HeadingText, ContentText } from './Text'
import Layout from '../constants/Layout'
import { useThemeProvider } from '../ThemeContext'
import { ConstantColors } from '../constants/Colors'

function MeasureListItemView(props) {
    const { colorTheme } = useThemeProvider()

    return (
        <View style={{ ...styles.outerWrapper, backgroundColor: colorTheme.componentBackground, ...props.style }}>
            <TouchableHighlight underlayColor={ConstantColors.lightgrey} onPress={props.measureSelected}>
                <View style={styles.innerWrapper}>
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
    measureContent: {
        flexDirection: "column",
        flex: 1
    },
    detailIcon: {
        alignSelf: "center",
    }
})

export default MeasureListItemView
