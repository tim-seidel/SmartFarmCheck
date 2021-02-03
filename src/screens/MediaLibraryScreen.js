import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { useDispatch, useSelector } from 'react-redux'

import RootView from '../components/RootView'
import { VIDEOSCREEN } from '../constants/Paths'
import { fetchMediaLibrary } from '../store/actions/mediaLibrary'
import NoContentView from '../components/NoContentView'
import Strings from '../constants/Strings'
import MediaLibraryListViewItem from '../components/MediaLibraryListViewItem'
import InformationCard, { InformationText } from '../components/InformationCard'
import { HeadingText } from '../components/Text'
import Keys from '../constants/Keys'

const MediaLibraryScreen = (props) => {
    const dispatch = useDispatch()
    const mediaLibrary = useSelector(state => state.mediaLibrary.all)

    const [isLoading, setIsLoading] = useState(false)
    const [hasNoNetwork, setHasNoNetwork] = useState(false)
    const [errorCode, setErrorCode] = useState(0)

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
        marginHorizontal: 8,
        marginVertical: 4
    },
    heading: {
        marginTop: 16,
        marginBottom: 8,
        marginStart: 2
    },
    card: {
        marginTop: 4
    }
})

export default MediaLibraryScreen
