import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import IconButton from '../components/IconButton';
import { HeadingText, ContentText } from './Text';
import Colors from '../constants/Colors';

function EventListItemView(props) {
    return (
        <View style={styles.event}>
            <HeadingText>{props.title}</HeadingText>
            <ContentText light>{props.short}</ContentText>
            <View style={styles.eventButtonRow}>
                <View style={styles.eventButtonWrapper}>
                    <IconButton icon="information-outline" text="Details" fontSize={15}></IconButton>
                </View>
                <View style={styles.eventButtonMarginWrapper}>
                    <IconButton icon="account-plus-outline" text="Anmelden" fontSize={15}></IconButton>
                </View>
                <View style={styles.eventButtonWrapper}>
                    <IconButton icon="bookmark-outline" text="Merken" fontSize={15}></IconButton>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    event: {
        flex: 1,
        marginVertical: 4,
        padding: 8,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: Colors.grey,
      },
      eventButtonRow: {
        flexDirection: "row",
        marginTop: 8
      },
      eventButtonWrapper: {
        flex: 1,
      },
      eventButtonMarginWrapper: {
        flex: 1,
        marginHorizontal: 4
      },
});

export default EventListItemView;