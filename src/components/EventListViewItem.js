import React from 'react'
import { Image, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import moment from 'moment'

import View from './common/View'
import IconButton from './common/IconButton'
import { HeadingText, ContentText } from './common/Text'

import Layout from '../constants/Layout'
import { darkTheme, lightTheme } from '../constants/Colors'

const EventListViewItem = (props) => {
    const event = props.event
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

    return (
        <View component style={{ ...styles.event, ...props.style }}>
            <HeadingText weight="bold">{event.title}</HeadingText>
            <View style={styles.separator} />

            {event.image && <Image style={styles.image} source={{ uri: `https://pas.sei-farbenfroh.de/v1/files/${event.image}` }} />}

            <View style={styles.row}>
                <Icon style={styles.leftIcon} color={colorTheme.textPrimary} name="calendar-outline" size={24}></Icon>
                <ContentText style={styles.text} large>{formatDate(moment(event.startDate), moment(event.endDate))}</ContentText>
            </View>
            <View style={styles.row}>
                <Icon style={styles.leftIcon} name="information-outline" color={colorTheme.textPrimary} size={24}></Icon>
                <ContentText style={styles.text} light numberOfLines={3}>{event.description}</ContentText>
            </View>
            {event.maxParticipantCount > 0 &&
                <View style={styles.row}>
                    <Icon style={styles.leftIcon} color={colorTheme.textPrimary} name="account-multiple" size={24} />
                    <ContentText style={styles.text}>{"Diese Veranstaltung ist auf " + event.maxParticipantCount + " Teilnehmer begrenzt!"}</ContentText>
                </View>}
            <View style={styles.eventButtonRow}>
                <View style={styles.eventButtonWrapper}>
                    <IconButton icon="web" text="Details" fontSize={15} onPress={props.onDetailPress} />
                </View>
                <View style={styles.eventButtonMarginWrapper}>
                    <IconButton icon="account-plus-outline" text="Anmelden" fontSize={15} onPress={props.onRegisterPress} />
                </View>
                <View style={styles.eventButtonWrapper}>
                    <IconButton icon="bookmark-outline" text="Merken" fontSize={15} onPress={props.onExportToCalendarPress} />
                </View>
            </View>
        </View>
    )
}

function formatDate(start, end) {
    if (start.isSame(end, 'day')) {
        return start.format("DD.MM.YYYY | HH:mm") + " - " + end.format("HH:mm")
    } else if (start.isSame(end, 'year')) {
        return start.format("DD.MM HH:mm") + " - " + end.format("DD.MM.YYYY HH:mm")
    } else {
        return start.format("DD.MM.YYYY HH:mm") + " - " + end.format("DD.MM.YYYY HH:mm")
    }
}

const styles = StyleSheet.create({
    event: {
        flex: 1,
        padding: 8,
        borderColor: Layout.borderColor,
        borderWidth: Layout.borderWidth,
        borderRadius: Layout.borderRadius
    },
    separator: {
        backgroundColor: Layout.borderColor,
        height: Layout.borderWidth,
        marginVertical: 8
    },
    text: {
        marginHorizontal: 8
    },
    image: {
        width: '100%',
        height: 150,

        marginBottom: 4,
        borderRadius: Layout.borderRadius
    },
    row: {
        flexDirection: "row",
        marginHorizontal: 4,
        marginVertical: 6
    },
    leftIcon: {
        marginEnd: 4,
    },
    eventButtonRow: {
        flexDirection: "row",
        marginTop: 4
    },
    eventButtonWrapper: {
        flex: 1,
    },
    eventButtonMarginWrapper: {
        flex: 1,
        marginHorizontal: 4
    },
})

export default EventListViewItem
