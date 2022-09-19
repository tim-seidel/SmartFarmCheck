import React, { useEffect, useState } from 'react'
import { Dimensions, Platform, StyleSheet, View } from 'react-native'
import * as Device from 'expo-device'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import { FlashList } from '@shopify/flash-list'

import RootView from '../components/common/RootView'
import InformationCard, { InformationText, InformationLineBreak } from '../components/common/InformationCard'
import { ContentText, HeadingText } from '../components/common/Text'

import Layout from '../constants/Layout'
import Strings from '../constants/Strings'
import Licenses from '../constants/Licenses'
import { darkTheme, lightTheme } from '../constants/Colors'

const LicenseListViewItem = (props) => {
	const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

	return (
		<View style={{ ...styles.license, backgroundColor: colorTheme.componentBackground }}>
			<View>
				<HeadingText style={styles.name}>{props.name}</HeadingText>
				{(props?.copyrigths ?? []).map((c) => {
					return <ContentText light>{c}</ContentText>
				})}
			</View>
		</View >
	)
}

const isPortrait = () => {
	const dim = Dimensions.get('screen');
	return dim.height >= dim.width;
};

const LicenseScreen = (props) => {
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

	const numCols = (isTablet || orientation == 'landscape') ? 2 : 1

	return (
		<RootView style={styles.container}>
			<FlashList
				estimatedItemSize={100}
				key={'cols_' + numCols} //Need to change the key aswell, because an on the fly update of numColumns is not supported and a full rerender is necessary
				numColumns={numCols}
				ListHeaderComponent={
					<InformationCard title={Strings.license_under_mit}>
						<InformationText>
							{Strings.license_mit_permission}
						</InformationText>
						<InformationLineBreak numOfBreaks={2} />
						<InformationText>
							{Strings.license_mit_condition}
						</InformationText>
						<InformationLineBreak numOfBreaks={2} />
						<InformationText>
							{Strings.license_mit_text}
						</InformationText>
					</InformationCard>
				}
				ListHeaderComponentStyle={styles.heading}
				data={Licenses}
				renderItem={({ item }) => (
					<LicenseListViewItem
						name={item.name}
						copyrigths={item.copyrigths}
					/>
				)}
				keyExtractor={item => item.name}
			/>
		</RootView>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 4
	},
	license: {
		flex: 1,
		paddingHorizontal: 8,
		paddingTop: 4,
		paddingBottom: 8,

		borderRadius: Layout.borderRadius,
		borderColor: Layout.borderColor,
		borderWidth: Layout.borderWidth,
		margin: 4
	},
	name: {
		marginBottom: 4
	},
	heading: {
		margin: 4
	}
})

export default LicenseScreen
