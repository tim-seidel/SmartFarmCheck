import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useSelector, useDispatch } from 'react-redux'
import NetInfo from '@react-native-community/netinfo';
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme';

import RootView from '../components/common/RootView';
import NoContentView from '../components/common/NoContentView'
import FormSelectListItemView from '../components/FormSelectListItemView'
import InformationCard, { InformationText } from '../components/common/InformationCard'
import { HeadingText, ContentText } from '../components/common/Text'

import Strings from '../constants/Strings'
import Keys from '../constants/Keys'
import { FORMSCREEN } from '../constants/Paths'
import { fetchForms } from '../store/actions/forms';
import Layout from '../constants/Layout';
import { darkTheme, lightTheme } from '../constants/Colors';

const FormSelectScreen = (props) => {
	const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

	const [isLoading, setIsLoading] = useState(false)
	const [hasNoNetwork, setHasNoNetwork] = useState(false)
	const [errorCode, setErrorCode] = useState(0)

	const dispatch = useDispatch()
	const forms = useSelector(state => state.forms.forms)
	const visibleForms = forms.filter(f => !f.hidden)

	useEffect(() => {
		checkAndLoadForms()
	}, [checkAndLoadForms])


	const checkAndLoadForms = useCallback(async () => {
		const netinfo = await NetInfo.fetch()
		if (netinfo.isConnected) {
			setIsLoading(true)
			try {
				await dispatch(fetchForms())
			} catch (err) {
				setErrorCode(err.name === "AbortError" ? 6000 : (err.status ?? -1))
			}
			setIsLoading(false)
		} else {
			setHasNoNetwork(true)
		}
	}, [dispatch])

	function retryHandler() {
		setErrorCode(0)
		setHasNoNetwork(false)
		checkAndLoadForms()
	}

	function formSelectedHandler(formUuid) {
		props.navigation.navigate(FORMSCREEN, formUuid)
	}

	const footer =
		<View style={{ ...styles.footer, backgroundColor: colorTheme.componentBackground }}>
			<Image source={require("../../assets/images/icon_mittelstand_192px.png")} style={styles.image} resizeMode="contain" />
			<View style={styles.footerContent}>
				<View style={styles.footerRow}>
					<Icon size={24} name="information-outline" color={colorTheme.textPrimary} />
					<HeadingText style={styles.footerContentHeading} weight="bold">{Strings.form_select_additional_forms}</HeadingText>
				</View>
				<ContentText light>{Strings.form_select_additional_forms_in_the_future_notice}</ContentText>
			</View>
		</View>

	var contentView = null
	if (errorCode !== 0) {
		contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.select_form_loading_error + "(Fehlercode: " + errorCode + ")"} />
	} else if (isLoading) {
		contentView = <NoContentView icon="cloud-download" loading title={Strings.select_form_loading} />
	} else if (hasNoNetwork && visibleForms.length === 0) {
		contentView = <NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.select_form_loading_no_network} />
	} else if (visibleForms.length === 0) {
		contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.select_form_loading_empty} />
	} else {
		const informationHeader =
			<View>
				<InformationCard
					toggleInformationEnabled
					style={styles.card}
					toggleStoreKey={Keys.INFORMATION_TOGGLE_FORM_SELECT_SCREEN}
					title={Strings.select_form_information_title}>
					<InformationText>{Strings.select_form_information_text}</InformationText>
				</InformationCard>
				<HeadingText large weight="bold" style={styles.heading}>{Strings.form_select_available_forms}</HeadingText>
			</View>

		contentView = (
			<FlatList
				style={styles.list}
				data={visibleForms}
				ListHeaderComponent={informationHeader}
				ListFooterComponent={footer}
				renderItem={({ item }) => (
					<FormSelectListItemView
						key={item.uuid}
						title={item.title}
						description={item.description}
						icon={item.icon}
						onSelected={() => formSelectedHandler(item.uuid)}
					/>
				)}
				keyExtractor={item => item.uuid}
			/>
		)
	}

	return (
		<RootView thin>
			{contentView}
		</RootView>
	)
}

const styles = StyleSheet.create({
	card: {
		marginTop: 8
	},
	heading: {
		marginVertical: 8
	},
	list: {
		marginHorizontal: 8
	},
	footer: {
		marginBottom: 8,
		borderRadius: Layout.borderRadius,
		borderColor: Layout.borderColor,
		borderWidth: Layout.borderWidth,
		overflow: "hidden",
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 8
	},
	footerRow: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	footerContent: {
		flexDirection: "column",
		flex: 1
	},
	footerContentHeading: {
		marginStart: 4,
		marginEnd: 8
	},
	image: {
		width: 64,
		height: 64,
		marginEnd: 8,
		borderRadius: Layout.borderRadius
	}
})

export default FormSelectScreen
