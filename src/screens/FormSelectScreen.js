import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import * as Device from 'expo-device'
import NetInfo from '@react-native-community/netinfo';

import RootView from '../components/common/RootView'
import NoContentView from '../components/common/NoContentView'
import FormSelectListItemView from '../components/FormSelectListItemView'
import InformationCard, { InformationText } from '../components/common/InformationCard'
import { HeadingText } from '../components/common/Text'

import Strings from '../constants/Strings'
import Keys from '../constants/Keys'
import { FORMSCREEN } from '../constants/Paths'
import { fetchForms } from '../store/actions/forms';
import { FlatList } from 'react-native-gesture-handler';

const formsMock = [
    {
        uuid: '1',
        title: 'Spezialisierung A',
        description: 'Dieses Formular legt den Schwerpunkt auf Fragen zu Betrieben, die primär der Spezialisierung A zugeordnet sind.'
    },
    {
        uuid: '2',
        title: 'Spezialisierung B',
        description: 'Dieses Formular legt den Schwerpunkt auf Fragen zu Betrieben, die primär der Spezialisierung B zugeordnet sind.'
    },
    {
        uuid: '3',
        title: 'Spezialisierung C',
        description: 'Dieses Formular legt den Schwerpunkt auf Fragen zu Betrieben, die primär der Spezialisierung C zugeordnet sind.'
    }
]

const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
};

const FormSelectScreen = (props) => {
    const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape')
    const [isTablet, setIsTablet] = useState(Platform.isPad)

    const [isLoading, setIsLoading] = useState(false)
    const [hasNoNetwork, setHasNoNetwork] = useState(false)
    const [errorCode, setErrorCode] = useState(0)

    const dispatch = useDispatch()
    const forms = useSelector(state => state.forms.forms)
    const [selectedForm, setSelectedForm] = useState(undefined)

    useEffect(() => {
        const callback = ({ screen }) => {
            setOrientation(screen.height >= screen.width ? 'portrait' : 'landscape')
        }
        const checkTablet = async () => {
            const type = await Device.getDeviceTypeAsync()
            setIsTablet(!(type === Device.DeviceType.PHONE || type === Device.DeviceType.UNKNOWN))
        }
        checkTablet()

        Dimensions.addEventListener('change', callback);
        return () => {
            Dimensions.removeEventListener('change', callback);
        };
    }, []);

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
        const informationHeader =
            <View>
                <InformationCard toggleInformationEnabled toggleStoreKey={Keys.INFORMATION_TOGGLE_FORM_SELECT_SCREEN} style={styles.card} title={Strings.select_form_information_title}>
                    <InformationText>{Strings.select_form_information_text}</InformationText>
                </InformationCard>
                <HeadingText large weight="bold" style={styles.heading}>Verfügbare Fragebögen:</HeadingText>
            </View>

        contentView = (
            <FlatList
                style={styles.list}
                data={forms}
                ListHeaderComponent={informationHeader}
                renderItem={({ item }) => (
                    <FormSelectListItemView
                        key={item.uuid}
                        title={item.title}
                        description={item.description}
                        onSelected={() => formSelectedHandler(item.uuid)}
                    />
                )}
                keyExtractor={item => item.uuid}
            />
        )
    }

    return (
        <RootView>
            {contentView}
        </RootView>
    )
}

const styles = StyleSheet.create({
    card: {
        marginTop: 8
    },
    heading: {
        marginTop: 16,
        marginBottom: 8,
        marginStart: 2
    },
    list: {
        marginHorizontal: 8
    }
})

export default FormSelectScreen
