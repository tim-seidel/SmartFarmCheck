import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HeadingText, ContentText } from './Text';
import Colors from '../constants/Colors';

const zeroPad = (value, places) => String(value).padStart(places, ' ')

function EvaluationListItemView(props) {
    return (
        <TouchableHighlight underlayColor={Colors.lightgrey} onPress={props.measureSelected}>
            <View style={styles.evaluationItem}>
                <Text style={styles.rating}>{zeroPad(props.rating, 2)}%</Text>
                <View style={styles.measureContent}>
                    <HeadingText large>{props.title}</HeadingText>
                    <ContentText light numberOfLines={2}>{props.short}</ContentText>
                </View>
                <Icon style={styles.detailIcon} name="chevron-right" size={32}></Icon>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
        evaluationItem: {
        marginVertical: 16,
        marginHorizontal: 8,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    rating: {
        fontSize: 28,
        fontWeight: "700",
        color: "green",
        textAlign: "center",
        textAlignVertical: "center",
        marginEnd: 8,
        width: 80
    }, measureContent: {
        flexDirection: "column",
        flex: 1
    },
    detailIcon: {
        alignSelf: "center"
    }
});

export default EvaluationListItemView;