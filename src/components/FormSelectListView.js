import React from 'react'
import { View, StyleSheet } from 'react-native'
import { FlashList } from '@shopify/flash-list'

import FormSelectListItemView from '../components/FormSelectListItemView'
import { HeadingText } from './common/Text';

import { getListItemPosition } from '../constants/Layout';
import Strings from '../constants/Strings';

function FormSelectListView(props) {
	const forms = props.forms

	const header =
		<View style={styles.header}>
			<HeadingText large weight="bold">{Strings.formselect_available_forms_title}</HeadingText>
		</View>

	return (
		<FlashList
			data={forms}
			estimatedItemSize={100}
			ListHeaderComponent={header}
			ListFooterComponent={props.footer}
			renderItem={({ item, index }) => (
				<FormSelectListItemView
					key={item.uuid}
					itemstyle={getListItemPosition(forms.length, index)}
					title={item.title}
					description={item.description}
					icon={item.icon}
					hidden={item.hidden}
					onSelected={() => { if (props.formSelected) props.formSelected(item.uuid) }}
				/>
			)
			}
			keyExtractor={item => item.uuid}
		/>
	)
}

const styles = StyleSheet.create({
	header: {
		marginVertical: 8
	}
})

export default FormSelectListView
