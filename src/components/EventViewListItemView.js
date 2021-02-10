import React from 'react'
import { StyleSheet, View } from 'react-native'
import moment from 'moment'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import IconButton from './IconButton'
import { HeadingText, ContentText } from './Text'
import Layout from '../constants/Layout'
import { useThemeProvider } from '../ThemeContext'

function EventListItemView(props) {
    const event = props.event
    const { colorTheme } = useThemeProvider()

    return (
        <View style={{ ...styles.event, backgroundColor: colorTheme.componentBackground, ...props.style }}>
            <HeadingText>{event.title}</HeadingText>
            <View style={styles.separator}></View>
            <View style={styles.dateRow}>
                <Icon style={{...styles.dateIcon, color: colorTheme.textPrimary}} name="calendar-outline" size={24}></Icon>
                <ContentText large>{formatDate(moment(event.startDate), moment(event.endDate))}</ContentText>
            </View>
            <ContentText light numberOfLines={3} style={{ paddingTop: 4, paddingBottom: 8 }}>{event.short}</ContentText>
            <View style={styles.eventButtonRow}>
                <View style={styles.eventButtonWrapper}>
                    <IconButton icon="information-outline" text="Details" fontSize={15} onPress={props.onDetailPress}></IconButton>
                </View>
                <View style={styles.eventButtonMarginWrapper}>
                    <IconButton icon="account-plus-outline" text="Anmelden" fontSize={15} onPress={props.onRegisterPress}></IconButton>
                </View>
                <View style={styles.eventButtonWrapper}>
                    <IconButton icon="bookmark-outline" text="Merken" fontSize={15} onPress={props.onExportToCalendarPress}></IconButton>
                </View>
            </View>
        </View>
    )
}

function formatDate(start, end) {
    var d = new Date()

    if (start.isSame(end, 'day')) {
        return start.format("DD.MM.YYYY | HH:mm") + " - " + end.format("HH:mm")
    } else if (start.isSame(end, 'year')) {
        return start.format("DD.MM.2020 HH:mm") + " - " + end.format("DD.MM.2020 HH:mm")
    } else {
        return start.format("DD.MM.YYYY HH:mm") + " - " + end.format("DD.MM.YYYY HH:mm")
    }
}

const styles = StyleSheet.create({
    event: {
        flex: 1,
        marginVertical: 4,
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
    dateRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    dateIcon: {
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

export default EventListItemView
