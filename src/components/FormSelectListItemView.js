import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import PropTypes from 'prop-types'

import { HeadingText, ContentText } from './common/Text'
import Layout from '../constants/Layout'
import { darkTheme, lightTheme } from '../constants/Colors'
import Strings from '../constants/Strings'

const FormSelectListItemView = (props) => {
	const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

    const itemstyle = props.itemstyle ?? Layout.ListItemPositions.single

    let outerstyle = styles.outerWrapperSingle
    if (itemstyle === Layout.ListItemPositions.header) outerstyle = styles.outerWrapperHeader
    if (itemstyle === Layout.ListItemPositions.middle) outerstyle = styles.outerWrapperMiddle
    if (itemstyle === Layout.ListItemPositions.footer) outerstyle = styles.outerWrapperFooter

	return (
		<View style={{ ...outerstyle, backgroundColor: colorTheme.componentBackground, ...props.style }}>
			<TouchableHighlight underlayColor={colorTheme.componentPressed} onPress={props.onSelected} disabled={props.hidden}>
				<View style={styles.innerWrapper}>
					{
						props.icon ?
							<Image source={{ uri: props.icon }} style={styles.image} /> :
							<Image source={require("../../assets/images/icon_mittelstand_192px.png")} style={styles.image} resizeMode="contain" />
					}
					<View style={styles.content}>
						<HeadingText disabled={props.hidden} weight="bold">{props.title}</HeadingText>
						<ContentText light numberOfLines={3} style={props.hidden ? styles.descriptionCommingSoon : styles.description}>{props.hidden ? Strings.formselect_form_comming_soon : props.description}</ContentText>
					</View>
					{!props.hidden && <Icon style={{ ...styles.detailIcon, color: colorTheme.textPrimary }} name="chevron-right-circle-outline" size={24} />}
				</View>
			</TouchableHighlight>
		</View>
	)
}

FormSelectListItemView.PropTypes = {
    liststyle : PropTypes.oneOf([Layout.ListItemPositions.single, Layout.ListItemPositions.header, Layout.ListItemPositions.middle, Layout.ListItemPositions.footer])
}
FormSelectListItemView.PropTypes = {
    liststyle: "single"
}

const styles = StyleSheet.create({
	outerWrapperHeader: {
		borderTopStartRadius: Layout.borderRadius,
		borderTopEndRadius: Layout.borderRadius,
		borderColor: Layout.borderColor,
		borderWidth: Layout.borderWidth,
		overflow: "hidden"
	},
    outerWrapperMiddle: {
		borderColor: Layout.borderColor,
		borderWidth: Layout.borderWidth,
        borderTopWidth: 0,
		overflow: "hidden"
	},
    outerWrapperFooter: {
		borderBottomStartRadius: Layout.borderRadius,
		borderBottomEndRadius: Layout.borderRadius,
		borderColor: Layout.borderColor,
		borderWidth: Layout.borderWidth,
        borderTopWidth: 0,
		overflow: "hidden"
	},
    outerWrapperSingle: {
        borderRadius: Layout.borderRadius,
        borderColor: Layout.borderColor,
		borderWidth: Layout.borderWidth,
		overflow: "hidden"
    },
	innerWrapper: {
		flexDirection: "row",
		justifyContent: "space-between",
		margin: 8
	},
	content: {
		flexDirection: "column",
		flex: 1
	},
    description: {
        marginTop: 2,
    },
    descriptionCommingSoon:{
        marginTop: 2,
        fontStyle: "italic"
    },
	detailIcon: {
		alignSelf: "center",
	},
	image: {
		width: 80,
		height: 80,
		marginEnd: 8,
		borderRadius: Layout.borderRadius
	},
})

export default FormSelectListItemView
