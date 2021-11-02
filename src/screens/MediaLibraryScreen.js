import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, FlatList, Platform, Dimensions } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { useDispatch, useSelector } from 'react-redux'
import * as Device from 'expo-device'

import RootView from '../components/common/RootView'
import NoContentView from '../components/common/NoContentView'
import MediaLibraryListViewItem from '../components/MediaLibraryListViewItem'

import { fetchMediaLibrary } from '../store/actions/mediaLibrary'
import Strings from '../constants/Strings'
import { VIDEOSCREEN } from '../constants/Paths'
import Network, { shouldUpate } from '../constants/Network'

const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
};

const MediaLibraryScreen = (props) => {
    const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape')
    const [isTablet, setIsTablet] = useState(Platform.isPad)
    const navigation = props.navigation

    const [isLoading, setIsLoading] = useState(false)
    const [hasNoNetwork, setHasNoNetwork] = useState(false)
    const [errorCode, setErrorCode] = useState(0)

    const dispatch = useDispatch()
    const mediaLibrary = useSelector(state => state.mediaLibrary.all)
    const updateTime = useSelector(state => state.mediaLibrary.updateTime)

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
        const unsubscribe = navigation.addListener('focus', () => {
            checkAndLoadVideoList()
        });

        return unsubscribe;
    }, [navigation, updateTime, mediaLibrary]);

    const checkAndLoadVideoList = useCallback(async () => {
        if (mediaLibrary.length > 0 && !shouldUpate(updateTime, Network.UPDATE_LIST_THRESHOLD)) return

        const netinfo = await NetInfo.fetch()
        if (netinfo.isConnected) {
            setIsLoading(true)
            try {
                await dispatch(fetchMediaLibrary())
            } catch (err) {
                console.log(err)
                setErrorCode(err.name === "AbortError" ? 6000 : (err.status ?? -1))
            }
            setIsLoading(false)
        } else {
            setHasNoNetwork(true)
        }
    }, [dispatch, updateTime, mediaLibrary])

    function retryHandler() {
        setErrorCode(0)
        setHasNoNetwork(false)
        checkAndLoadVideoList()
    }

    const showVideoHandler = (videoLink) => {
        navigation.navigate(VIDEOSCREEN, videoLink)
    }

    let contentView = null

    if (errorCode !== 0) {
        contentView = <NoContentView icon="emoticon-sad-outline" onRetry={retryHandler} title={Strings.medialibrary_loading_error + " (Fehlercode: " + errorCode + ")"}></NoContentView>
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
                renderItem={({ item }) => (
                    <MediaLibraryListViewItem
                        style={styles.media}
                        title={item.title}
                        description={item.description}
                        thumbnail={item.thumbnail}
                        onShowVideo={() => showVideoHandler(item.videoLink)}
                    />
                )}
                keyExtractor={item => item.uuid}
            />
    }
    return (
        <RootView thin={mediaLibrary && mediaLibrary.length === 1}>
            {contentView}
        </RootView>
    )
}

const styles = StyleSheet.create({
    list: {
        marginHorizontal: 4,
        marginTop: 8,
    },
    media: {
        marginHorizontal: 4,
        marginBottom: 8,
        flex: 1,
    }
})

export default MediaLibraryScreen
