import React, { useEffect, useState } from 'react'
import { View, Dimensions, Linking, Platform, StyleSheet, Alert } from 'react-native'
import * as Device from 'expo-device'
import { FlashList } from '@shopify/flash-list'

import EventListViewItem from './EventListViewItem'

import Strings from '../constants/Strings'

function openFallBackEventWebsite() {
	Linking.canOpenURL(Strings.mittelstand_40_lingen_events_url).then(can => {
		if (can) {
			Linking.openURL(Strings.mittelstand_40_lingen_events_url)
		} else {
			Alert.alert(Strings.event_website_url_open_error_title, Strings.event_website_url_open_error_description, [
				{ text: Strings.okay, onPress: () => { } },
			]);
		}
	})
}

function openEventURLorFallback(event) {
	if (!event || !event.link) {
		openFallBackEventWebsite()
	} else {
		Linking.canOpenURL(event.link).then(can => {
			if (can) {
				Linking.openURL(event.link)
			} else {
				openFallBackEventWebsite()
			}
		})
	}
}

function showDetailHandler(event) {
	openEventURLorFallback(event)
}

function showRegisterHandler(event) {
	openEventURLorFallback(event)
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

		const subscribtion = Dimensions.addEventListener('change', callback);
		return () => subscribtion.remove();
	}, []);

	return (
		<View style={props.style}>
			<FlashList
				estimatedItemSize={250}
				data={props.events}
				ListHeaderComponent={props.footer}
				ListFooterComponent={props.header}
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
		</View>
	)
}

const styles = StyleSheet.create({
	event: {
		marginHorizontal: 4,
		marginTop: 8
	},
})

export default EventListView
