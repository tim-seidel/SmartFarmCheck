import React, {useEffect, useState} from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'

import Layout from '../constants/Layout';
import { ContentText, HeadingText } from './common/Text';
import { darkTheme, lightTheme } from '../constants/Colors';
import View from './common/View';

const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
};

const Competence = (props) => {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

    return (
        <View component style={{ ...styles.competence, ...props.style }}>
            <Icon name={props.icon} color={colorTheme.textPrimary} size={36} />
            <View style={{ marginHorizontal: 8, flex: 1 }}>
                <HeadingText weight="bold">{props.heading}</HeadingText>
                {props.children}
            </View>
        </View>
    )
}

function Competences(props) {
    const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape')
    const competenceStyle = orientation === 'portrait' ? styles.competenceSingleItem : styles.competenceGridItem

    useEffect(() => {
        const callback = ({ screen }) => {
            setOrientation(screen.height >= screen.width ? 'portrait' : 'landscape')
        }

        Dimensions.addEventListener('change', callback);
        return () => {
            Dimensions.removeEventListener('change', callback);
        };
    }, []);

    return <View style={styles.competenceGrid}>
        <View style={competenceStyle}>
            <Competence style={styles.equalHeightInRow} heading="Angebot 1" icon="lightbulb-on-outline">
                <ContentText light>Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.</ContentText>
            </Competence>
        </View>
        <View style={competenceStyle}>
            <Competence style={styles.equalHeightInRow} heading="Angebot 2" icon="account-group-outline" >
                <ContentText light>Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.</ContentText>
            </Competence>
        </View>
        <View style={styles.competenceSingleItem}>
            <Competence style={styles.equalHeightInRow} heading="Angebot 3" icon="forum-outline">
                <ContentText light>Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. </ContentText>
            </Competence>
        </View>
    </View>
}

const styles = StyleSheet.create({
    competenceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        padding: 4
    },
    competence: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderColor: Layout.borderColor,
        borderWidth: Layout.borderWidth,
        borderRadius: Layout.borderRadius
    },
    competenceSingleItem: {
        padding: 4,
        width: '100%'
    },
    competenceGridItem: {
        padding: 4,
        width: '50%'
    },
})

export default Competences
