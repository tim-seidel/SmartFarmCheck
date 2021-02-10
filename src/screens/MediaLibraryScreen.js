import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, FlatList, Platform, Dimensions } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { useDispatch, useSelector } from 'react-redux'
import * as Device from 'expo-device'

import RootView from '../components/RootView'
import { VIDEOSCREEN } from '../constants/Paths'
import { fetchMediaLibrary } from '../store/actions/mediaLibrary'
import NoContentView from '../components/NoContentView'
import Strings from '../constants/Strings'
import MediaLibraryListViewItem from '../components/MediaLibraryListViewItem'
import InformationCard, { InformationText } from '../components/InformationCard'
import { HeadingText } from '../components/Text'
import Keys from '../constants/Keys'

const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
};

const MediaLibraryScreen = (props) => {
    const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape')
    const [isTablet, setIsTablet] = useState(Platform.isPad)

    const [isLoading, setIsLoading] = useState(false)
    const [hasNoNetwork, setHasNoNetwork] = useState(false)
    const [errorCode, setErrorCode] = useState(0)

    const dispatch = useDispatch()
    const mediaLibrary = useSelector(state => state.mediaLibrary.all)

    useEffect(() => {
        const callback = ({ screen }) => {
          setOrientation(screen.height >= screen.width ? 'portrait' : 'landscape')
        }
        const checkTablet = async () => {
          const type = Device.getDeviceTypeAsync()
          setIsTablet(!(type === Device.DeviceType.PHONE || type === Device.DeviceType.UNKNOWN))
        }
        checkTablet()
    
        Dimensions.addEventListener('change', callback);
        return () => {
          Dimensions.removeEventListener('change', callback);
        };
    }, []);    

    useEffect(() => {
        checkAndLoadVideoList()
    }, [checkAndLoadVideoList])

    const checkAndLoadVideoList = useCallback(async () => {
        const netinfo = await NetInfo.fetch()
        if (netinfo.isConnected) {
            setIsLoading(true)
            try {
                await dispatch(fetchMediaLibrary())
            } catch (err) {
                console.log(err)
                setErrorCode(err.status ?? -1)
            }
            setIsLoading(false)
        } else {
            setHasNoNetwork(true)
        }
    }, [dispatch])

    function retryHandler() {
        setErrorCode(0)
        setHasNoNetwork(false)
        checkAndLoadVideoList()
    }

    const showVideoHandler = (url) => {
        props.navigation.navigate(VIDEOSCREEN, url)
    }

    let contentView = null

    if (errorCode !== 0) {
        contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.medialibrary_loading_error + "(Fehlercode: " + errorCode + ")"}></NoContentView>
    } else if (isLoading) {
        contentView = <NoContentView icon="cloud-download" loading title={Strings.medialibrary_loading}></NoContentView>
    } else if (hasNoNetwork && mediaLibrary.length === 0) {
        contentView = <NoContentView icon="cloud-off-outline" title={Strings.measure_loading_no_network} onRetry={retryHandler}></NoContentView>
    } else if (!mediaLibrary || mediaLibrary.length === 0) {
        contentView = <NoContentView icon="calendar-remove" retryTitle={Strings.refresh} onRetry={retryHandler} title={Strings.medialibrary_loading_empty}></NoContentView>
    } else {
        contentView =
            <FlatList
                key={(isTablet && orientation === 'landscape' ? 'l' : 'p')} //Need to change the key aswell, because an on the fly update of numColumns is not supported and a full rerender is necessary
                numColumns={isTablet && orientation === 'landscape' ? 2 : 1}
                style={styles.list}
                data={mediaLibrary}
                ListHeaderComponent={
                    <View>
                        <InformationCard
                            toggleInformationEnabled
                            toggleStoreKey={Keys.INFORMATION_TOGGLE_MEDIALIBRARY_SCREEN}
                            title={Strings.medialibrary_card_title}
                            style={styles.card}
                            >
                            <InformationText>{Strings.medialibrary_card_description}</InformationText>
                        </InformationCard>
                        <HeadingText large weight="bold" style={styles.heading}>{Strings.medialibrary_heading}</HeadingText>
                    </View>}
                renderItem={({ item }) => (
                    <MediaLibraryListViewItem
                        style={styles.mediaLibraryColumn}
                        title={item.title}
                        description={item.description}
                        onShowVideo={() => showVideoHandler(item.url)}
                    />
                )}
                keyExtractor={item => item.uuid}
            />
    }
    return (
        <RootView>
            {contentView}
        </RootView>
    )
}

const styles = StyleSheet.create({
    list: {
        margin: 4
    },
    heading: {
        marginTop: 16,
        marginBottom: 8,
        marginStart: 6
    },
    card: {
        marginTop: 4,
        marginHorizontal: 4
    },
    mediaLibraryColumn: {
        margin: 4,
        flex: 1
    }
})

export default MediaLibraryScreen
