import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'

import { ContentText, HeadingText } from './common/Text';
import { WrappedIconButton } from './common/IconButton';
import View from './common/View';

import { darkTheme, lightTheme } from '../constants/Colors';
import Layout from '../constants/Layout';
import Strings from '../constants/Strings';
import { FORMSELECTSCREEN } from '../constants/Paths';

const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
};

const Competence = props => {
    const colorTheme = useColorScheme() === 'dark' ? darkTheme : lightTheme

    return (
        <View component style={{ ...styles.competence, ...props.style }}>
            <Icon name={props.icon} color={colorTheme.textPrimary} size={36} />
            <View style={{ marginStart: 8, flex: 1 }}>
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

    function gotoFormSelectHandler() {
        props.navigation.navigate(FORMSELECTSCREEN)
    }

    return <View style={styles.competenceGrid}>
        <View style={competenceStyle}>
            <Competence style={styles.equalHeightInRow} heading="Digitaliserungs-Check" icon="lightbulb-on-outline">
                <ContentText light>Anhand eines Fragebogens erhalten Sie Empfehlungen für Digitalisierungsmaßnahmen, basierend auf der Befragung vieler Betriebe.</ContentText>
                <WrappedIconButton style={styles.button} icon="clipboard-text-outline" text={Strings.measure_navigate_evaluation} onPress={gotoFormSelectHandler} />
            </Competence>
        </View>
        <View style={competenceStyle}>
            <Competence style={styles.equalHeightInRow} heading="Angebot 2" icon="account-group-outline" >
                <ContentText light>Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet.</ContentText>
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
        alignItems: "flex-start",
        flex: 1,
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
    button: {
        marginTop: 8
    }
})

export default Competences
