import React from 'react'
import { View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { TouchableHighlight } from 'react-native-gesture-handler'

import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme'
import { ConstantColors, darkTheme, lightTheme } from '../constants/Colors'
import { ContentText, HeadingText } from '../components/common/Text'

import Layout from '../constants/Layout'

const SettingsClickView = (props) => {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme
    const {icon, name, description, onPress} = props
    const disabledStyle = onPress ? {} : {color: ConstantColors.grey} 
    
    const descriptionView = description ? (<ContentText light style={styles.description}>{description}</ContentText>) : null
    return (
        <View style={{ ...styles.container, backgroundColor: colorTheme.componentBackground, ...props.style }}>
            <TouchableHighlight underlayColor={colorTheme.componentPressed} onPress={onPress}>
                <View style={styles.row}>
                    <Icon style color={onPress ? colorTheme.textPrimary : ConstantColors.grey} name={icon} size={24} />
                    <View style={styles.content}>
                        <HeadingText style={[styles.name, disabledStyle]}>{name}</HeadingText>
                        {descriptionView}
                    </View>
                    {onPress && <Icon style={styles.icon} color={colorTheme.textPrimary} name="chevron-right" size={24} /> }
                </View>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        borderColor: Layout.borderColor,
        borderRadius: Layout.borderRadius,
        borderWidth: Layout.borderWidth
    },
    row: {
        flexDirection: 'row',
        padding: 8,
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start'
    },
    name: {
        marginHorizontal: 16
    },
    description: {
        marginHorizontal: 16,
        marginTop: 4
    },
    icon: {
        marginEnd: 8,
        alignSelf: 'center'
    }
})

export default SettingsClickView