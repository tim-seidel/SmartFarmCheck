import React from 'react'
import { Image, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import moment from 'moment'

import View from './common/View'
import IconButton from './common/IconButton'
import { HeadingText, ContentText } from './common/Text'
import Separator from './common/Separator'

import Layout from '../constants/Layout'
import { darkTheme, lightTheme } from '../constants/Colors'
import Strings from '../constants/Strings'
import API from '../constants/API'

const EventListViewItem = (props) => {
    const event = props.event
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

    return (
        <View component style={{ ...styles.event, ...props.style }}>
            <HeadingText weight="bold">{event.title}</HeadingText>
            <Separator style={styles.separator} />
            {event.image && <Image style={styles.image} source={{ uri: `${API.URL}/${API.VERSION}/files/${event.image}` }} />}
            <View style={styles.row}>
                <Icon
                    style={styles.leftIcon}
                    color={colorTheme.textPrimary}
                    name="calendar-outline"
                    size={24} />
                <ContentText style={styles.text} large>{formatDate(moment(event.startDate), moment(event.endDate))}</ContentText>
            </View>
            <View style={styles.row}>
                <Icon
                    style={styles.leftIcon}
                    name="information-outline"
                    color={colorTheme.textPrimary}
                    size={24} />
                <ContentText style={styles.text} light numberOfLines={3}>{event.description ?? Strings.event_no_description_available}</ContentText>
            </View>
            {event.maxParticipantCount > 0 &&
                <View style={styles.row}>
                    <Icon style={styles.leftIcon} color={colorTheme.textPrimary} name="account-multiple" size={24} />
                    <ContentText style={styles.text}>{Strings.event_max_participant_1 + event.maxParticipantCount + Strings.event_max_participant_2}</ContentText>
                </View>}
            <View style={styles.eventButtonRow}>
                <View style={styles.eventButtonLeft}>
                    <IconButton
                        icon="web"
                        fontSize={15}
                        text={Strings.event_details}
                        onPress={props.onDetailPress} />
                </View>
                <View style={styles.eventButtonRight}>
                    <IconButton
                        icon="account-plus-outline"
                        text={Strings.event_register}
                        fontSize={15}
                        onPress={props.onRegisterPress} />
                </View>
            </View>
        </View>
    )
}

function formatDate(start, end) {
    const date0 = moment(0)
    const hasStart = !date0.isSame(start)
    const hasEnd = !date0.isSame(end)

    if (!hasStart && !hasEnd) return Strings.event_time_undefined

    if (start.isSame(end, 'day')) {
        return start.format("DD.MM.YYYY | HH:mm") + " - " + end.format("HH:mm")
    } else if (start.isSame(end, 'year')) {
        return start.format("DD.MM HH:mm") + " - " + end.format("DD.MM.YYYY HH:mm")
    } else {
        return (hasStart ? start.format("DD.MM.YYYY HH:mm") : Strings.event_start_or_end_undefined) + " - " + (hasEnd ? end.format("DD.MM.YYYY HH:mm") : Strings.event_start_or_end_undefined)
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
    eventButtonLeft: {
        flex: 1,
        marginEnd: 2
    },
    eventButtonRight: {
        flex: 1,
        marginStart: 2
    },
})

export default EventListViewItem
