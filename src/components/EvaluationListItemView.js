import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

const zeroPad = (value, places) => String(value).padStart(places, ' ')

function EvaluationListItemView(props) {
    return (
        <TouchableHighlight style={styles.container} underlayColor="gray" onPress={props.measureSelected}>
            <View style={styles.evaluationItem}>
                <Text style={styles.rating}>{zeroPad(props.rating, 2)}%</Text>
                <View style={styles.content}>
                    <Text style={styles.title}>{props.title}</Text>
                    <Text numberOfLines={2} style={styles.short}>{props.short}</Text>
                </View>
                <Icon style={styles.detailIcon} name="chevron-right" size={32}></Icon>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    evaluationItem: {
        paddingHorizontal: 8,
        paddingVertical: 12,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        borderColor: "black",
        borderBottomWidth: 0.5
    },
    rating: {
        fontSize: 28,
        fontWeight: "700",
        color: "green",
        textAlign: "right",
        textAlignVertical: "center",
        marginEnd: 8,
        width: 80
    }, content: {
        flexDirection: "column",
        flex: 1
    },
    title: {
        fontSize: 22,
    },
    short: {
        fontSize: 16,
        color: 'rgba(96,100,109, 1)',
    },
    detailIcon: {
        alignSelf: "center"
    }
});

export default EvaluationListItemView;