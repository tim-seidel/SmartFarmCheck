import React from 'react'
import { StyleSheet, View, Linking, Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import RootView from '../components/common/RootView'
import SponsorView from '../components/SponsorView'
import IconButton from '../components/common/IconButton'
import { HeadingText } from '../components/common/Text'

import { IMPRINTSCREEN, PRIVACYSCREEN } from '../constants/Paths'
import Strings from '../constants/Strings'

const onSponsorPressedHandler = (url) => {
	if (!url) return
	Linking.canOpenURL(url).then(can => {
		if (can) {
			Linking.openURL(url)
		} else {
			Alert.alert(Strings.imprint_open_url_error_title, Strings.imprint_open_url_error_description, [
				{ text: Strings.okay, onPress: () => { } },
			]);
		}
	})
}

export default function AboutScreen({ navigation }) {
	return (
		<RootView thin>
			<ScrollView style={styles.scroll} >
				<HeadingText large weight="bold" style={styles.title}>{Strings.imprint_sponsored_by + ":"}</HeadingText>
				<SponsorView style={styles.sponsor} name={Strings.imprint_mittelstand_4} onPress={onSponsorPressedHandler.bind(this, Strings.mittelstand_40_lingen_url)} localPath={require("../../assets/images/logos/logo_mkl_1024px_300ppi.png")} />
				<SponsorView style={styles.sponsor} name={Strings.imprint_mittelstand_digital} onPress={onSponsorPressedHandler.bind(this, "https://www.mittelstand-digital.de")} localPath={require("../../assets/images/logos/logo_mittelstand_digital.png")} />
				<SponsorView style={styles.sponsor} name={Strings.imprint_bmwk} onPress={onSponsorPressedHandler.bind(this, "https://www.bmwi.de/Navigation/DE/Home/home.html")} localPath={require("../../assets/images/logos/logo_bmwk.png")} />
			</ScrollView>
			<View style={styles.buttonRow}>
				<View style={styles.imprintButton}>
					<IconButton icon="information-variant" text={Strings.imprint} onPress={() => { navigation.navigate(IMPRINTSCREEN) }} />
				</View>
				<View style={styles.privacyButton}>
					<IconButton icon="lock" text={Strings.privacy} onPress={() => { navigation.navigate(PRIVACYSCREEN) }} />
				</View>
			</View>
		</RootView>
	)
}

const styles = StyleSheet.create({
	scroll: {
		marginBottom: 8,
		marginHorizontal: 8
	},
	title: {
		marginTop: 8,
	},
	sponsor: {
		marginTop: 8,
	},
	buttonRow: {
		flexDirection: 'row'
	},
	imprintButton: {
		flex: 1,
		marginLeft: 8,
		marginRight: 4,
		marginBottom: 8
	}
	,
	privacyButton: {
		flex: 1,
		marginLeft: 4,
		marginRight: 8,
		marginBottom: 8
	}
})
