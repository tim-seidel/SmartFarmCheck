import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import NetInfo from '@react-native-community/netinfo';
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme';

import RootView from '../components/common/RootView';
import NoContentView from '../components/common/NoContentView'
import { HeadingText, ContentText } from '../components/common/Text'

import Strings from '../constants/Strings'
import { FORMSCREEN, CONTACTSCREEN } from '../constants/Paths'
import { fetchForms } from '../store/actions/forms';
import Layout, { getListItemPosition } from '../constants/Layout';
import { darkTheme, lightTheme } from '../constants/Colors';
import IconButton from '../components/common/IconButton';
import FormSelectListView from '../components/FormSelectListView';

const FormSelectScreen = (props) => {
	const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

	const [isLoading, setIsLoading] = useState(false)
	const [hasNoNetwork, setHasNoNetwork] = useState(false)
	const [errorCode, setErrorCode] = useState(0)

	const dispatch = useDispatch()
	const forms = useSelector(state => state.forms.forms)

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
			<HeadingText weight="bold">{Strings.formselect_nothing_fitting_title}</HeadingText>
			<ContentText style={styles.notingFittingDetail}>{Strings.formselect_nothing_fitting_content}</ContentText>
			<IconButton
				text={Strings.formselect_nothing_fitting_goto_contact}
				icon="card-account-mail-outline"
				onPress={() => { props.navigation.navigate(CONTACTSCREEN) }} />
		</View>

	var contentView = null
	if (errorCode !== 0) {
		contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.select_form_loading_error + "(Fehlercode: " + errorCode + ")"} />
	} else if (isLoading) {
		contentView = <NoContentView icon="cloud-download" loading title={Strings.select_form_loading} />
	} else if (hasNoNetwork && forms.length === 0) {
		contentView = <NoContentView icon="cloud-off-outline" onRetry={retryHandler} title={Strings.select_form_loading_no_network} />
	} else if (forms.length === 0) {
		contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.select_form_loading_empty} />
	} else {
		contentView = (
			<View style={styles.listWrapper}>
				<FormSelectListView forms={forms} footer={footer} formSelected={formSelectedHandler}/>
			</View>
		)
	}

	return (
		<RootView thin>
			{contentView}
		</RootView>
	)
}

const styles = StyleSheet.create({
	notingFittingDetail: {
		marginVertical: 4
	},
	image: {
		width: 64,
		height: 64,
		marginEnd: 8,
		borderRadius: Layout.borderRadius
	},
	listWrapper: {
		marginHorizontal: 8,
		flex: 1
	},
	footer: {
		marginVertical: 8,
		borderRadius: Layout.borderRadius,
		borderColor: Layout.borderColor,
		borderWidth: Layout.borderWidth,
		overflow: "hidden",
		justifyContent: "space-between",
		padding: 8
	},
})

export default FormSelectScreen
