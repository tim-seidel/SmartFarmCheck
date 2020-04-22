import React from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import IconButton from '../components/IconButton';

function EventListItemView(props) {
    return (
        <View style={styles.event}>
            <Text style={styles.eventTitle}>{props.title}</Text>
            <Text style={styles.eventShort}>{props.short}</Text>
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
        borderColor: "black",
        backgroundColor: "white"
      },
      eventTitle: {
        fontSize: 20,
        fontWeight: "700"
      },
      eventShort: {
        fontSize: 16,
        color: 'rgba(96,100,109, 1)',
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