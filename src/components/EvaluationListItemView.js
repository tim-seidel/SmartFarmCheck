import React from 'react';
import { StyleSheet, Text, View, useColorScheme, } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HeadingText, ContentText } from './Text';
import {ColorTheme} from'../constants/Colors';
import Layout from '../constants/Layout';

const zeroPad = (value, places) => String(value).padStart(places, ' ')

function EvaluationListItemView(props) {
    return (
        <View style={styles.outerWrapper}>
        <TouchableHighlight underlayColor={ColorTheme.current.lightgrey} onPress={props.measureSelected}>
            <View style={styles.innerWrapper}>
                <Text style={styles.rating}>{zeroPad(props.rating, 2)}%</Text>
                <View style={styles.divider}></View>
                <View style={styles.measureContent}>
                    <HeadingText large>{props.title}</HeadingText>
                    <ContentText light numberOfLines={3} style={{marginVertical: 4}}>{props.short}</ContentText>
                </View>
                <Icon style={styles.detailIcon} name="chevron-right" size={32}></Icon>
            </View>
        </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    outerWrapper: {
        marginVertical: 12,
        borderRadius: Layout.borderRadius, 
        borderColor: Layout.borderColor,
        borderWidth: Layout.borderWidth,
        backgroundColor: ColorTheme.current.componentBackground,
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
    divider:{
        width: Layout.borderWidth,
        height: "100%",
        marginStart: 4,
        marginEnd: 8,
        backgroundColor: ColorTheme.current.textPrimary,
    },
    measureContent: {
        flexDirection: "column",
        flex: 1
    },
    detailIcon: {
        alignSelf: "center",
        color: ColorTheme.current.textPrimary
    }
});

export default EvaluationListItemView;