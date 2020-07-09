import  React from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HeadingText, ContentText } from './Text';

function MeasureListItemView(props) {
    return (
        <TouchableHighlight underlayColor="gray" onPress={props.measureSelected}>
            <View style={styles.measure}>
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
    measure: {
        paddingHorizontal: 8,
        paddingVertical: 12,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    measureContent: {
        flexDirection: "column",
        flex: 1
    },
    detailIcon: {
        alignSelf: "center"
    }
});

export default MeasureListItemView;