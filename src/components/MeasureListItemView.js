import  React from 'react';
import { StyleSheet, Text, View, useColorScheme, } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HeadingText, ContentText } from './Text';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

function MeasureListItemView(props) {
    return (
        <View style={styles.outerWrapper}>
        <TouchableHighlight underlayColor={Colors.lightgrey} onPress={props.measureSelected}>
            <View style={styles.innerWrapper}>
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
        backgroundColor: Colors.white,
        overflow: "hidden"
    },
    innerWrapper:{
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
        alignSelf: "center"
    }
});

export default MeasureListItemView;