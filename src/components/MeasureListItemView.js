import * as React from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

function MeasureListItemView(props) {
    return (
        <TouchableHighlight underlayColor="gray" onPress={props.measureSelected}>
            <View style={styles.measure}>
                <View style={styles.measureContent}>
                    <Text style={styles.measureTitle}>{props.title}</Text>
                    <Text numberOfLines={2} style={styles.measureShort}>{props.short}</Text>
                </View>
                <Icon style={styles.detailIcon} name="chevron-right" size={32}></Icon>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    measure: {
        paddingHorizontal: 8,
        paddingVertical: 12,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        borderColor: "black",
        borderBottomWidth: 0.5
    },
    measureContent: {
        flexDirection: "column",
        flex: 1
    },
    measureTitle: {
        fontSize: 22,
    },
    measureShort: {
        fontSize: 16,
        color: 'rgba(96,100,109, 1)',
    },
    detailIcon: {
        alignSelf: "center"
    }
});

export default MeasureListItemView;