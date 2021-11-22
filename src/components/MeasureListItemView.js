import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import { HeadingText, ContentText } from './common/Text'
import Layout from '../constants/Layout'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import { darkTheme, lightTheme } from '../constants/Colors'

function MeasureListItemView(props) {
	const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

	return (
		<View
			style={{
				...styles.outerWrapper,
				backgroundColor: colorTheme.componentBackground,
				...props.style
			}}>
			<TouchableHighlight
				underlayColor={colorTheme.componentPressed}
				onPress={props.measureSelected}>
				<View style={styles.innerWrapper}>
					<View style={styles.measureContent}>
						<View style={styles.hastags}>
							{props.keywords.map((kw, index) => (<View key={kw} style={index == 0 ? styles.hastag : [styles.hastag, { marginStart: 4 }]}>
								<ContentText light small>{"#" + kw}</ContentText>
							</View>))}
						</View>
						<HeadingText
							weight="bold">{props.title}</HeadingText>
						<ContentText
							light
							numberOfLines={3}
							style={{ marginVertical: 4 }}>{props.short}</ContentText>
					</View>
					<Icon
						style={{
							...styles.detailIcon,
							color: colorTheme.textPrimary
						}}
						name="chevron-right"
						size={32} />
				</View>
			</TouchableHighlight>
		</View>
	)
}

const styles = StyleSheet.create({
	outerWrapper: {
		borderRadius: Layout.borderRadius,
		borderColor: Layout.borderColor,
		borderWidth: Layout.borderWidth,
		overflow: "hidden"
	},
	innerWrapper: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 8,
		paddingVertical: 12
	},
	measureContent: {
		flexDirection: "column",
		flex: 1
	},
	detailIcon: {
		alignSelf: "center",
	},
	hastags: {
		flexDirection: 'row'
	},
	hastag: {
		borderRadius: Layout.borderRadius * 2,
		borderColor: Layout.borderColor,
		borderWidth: Layout.borderWidth,
		paddingHorizontal: 4,
		paddingVertical: 2,
		alignSelf: 'flex-start'
	}
})

export default MeasureListItemView
