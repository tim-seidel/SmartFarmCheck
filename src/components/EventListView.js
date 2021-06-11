import React from 'react'
import { useEffect, useState } from 'react'
import { Dimensions, Linking, Platform, StyleSheet } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import * as Device from 'expo-device'

import EventListViewItem from './EventListViewItem'

function showDetailHandler(event) {
    Linking.openURL(event.link)
}

function showRegisterHandler(event) {
    Linking.openURL(event.link)
}

const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
};

const EventListView = (props) => {
    const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape')
    const [isTablet, setIsTablet] = useState(Platform.isPad)

    useEffect(() => {
        const callback = ({ screen }) => {
            setOrientation(screen.height >= screen.width ? 'portrait' : 'landscape')
        }
        const checkTablet = async () => {
            const type = await Device.getDeviceTypeAsync()
            setIsTablet(!(type === Device.DeviceType.PHONE || type === Device.DeviceType.UNKNOWN))
        }
        checkTablet()

        Dimensions.addEventListener('change', callback);
        return () => {
            Dimensions.removeEventListener('change', callback);
        };
    }, []);

    return (
        <FlatList
            style={props.style}
            nestedScrollEnabled
            ListHeaderComponent={props.headerContent}
            data={props.events}
            key={(isTablet && orientation === 'landscape' ? 'l' : 'p')} //Need to change the key aswell, because an on the fly update of numColumns is not supported and a full rerender is necessary
            numColumns={isTablet && orientation === 'landscape' ? 2 : 1}
            renderItem={({ item }) => (
                <EventListViewItem
                    key={item.uuid}
                    style={styles.event}
                    event={item}
                    onDetailPress={() => showDetailHandler(item)}
                    onRegisterPress={() => showRegisterHandler(item)}
                    onExportToCalendarPress={() => props.onExportToCalendarPress(item)}
                />
            )}
            keyExtractor={item => item.uuid}
        />
    )
}

const styles = StyleSheet.create({
    event: {
        marginHorizontal: 8,
        marginTop: 8
    },
})

export default EventListView
