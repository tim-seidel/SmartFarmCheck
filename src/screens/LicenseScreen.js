import React, { useEffect, useState } from 'react'
import { Dimensions, Platform, StyleSheet, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import * as Device from 'expo-device'

import RootView from '../components/RootView'
import InformationCard, { InformationText, LineBreak } from '../components/InformationCard'
import { ContentText, HeadingText } from '../components/Text'
import Layout from '../constants/Layout'
import { useThemeProvider } from '../ThemeContext'

const licenses = [
    {
        name: "@expo/vector-icons",
        copyrigths: [
            "Copyright (c) 2015 Joel Arvidsson",
            "Copyright (c) 2020 650 Industries"
        ]
    },
    {
        name: "@react-native-async-storage/async-storage",
        copyrigths: [
            "Copyright (c) 2015-present, Facebook, Inc.",
        ]
    },
    {
        name: "@react-native-community/netinfo",
        copyrigths: [
            "Copyright (c) 2015-present, Facebook, Inc."
        ]
    },
    {
        name: "@react-native-picker/picker",
        copyrigths: [
            "Copyright (c) 2015-present, Facebook, Inc."
        ]
    },
    {
        name: "@react-navigation/bottom-tabs",
        copyrigths: [
            "Copyright (c) 2017 React Navigation Contributors"
        ]
    },
    {
        name: "@react-navigation/native",
        copyrigths: [
            "Copyright (c) 2017 React Navigation Contributors"
        ]
    },
    {
        name: "@react-navigation/stack",
        copyrigths: [
            "Copyright (c) 2017 React Navigation Contributors"
        ]
    },
    {
        name: "expo",
        copyrigths: [
            "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
        ]
    },
    {
        name: "expo-asset",
        copyrigths: [
            "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
        ]
    },
    {
        name: "expo-av",
        copyrigths: [
            "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
        ]
    },
    {
        name: "expo-calendar",
        copyrigths: [
            "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
        ]
    },
    {
        name: "expo-constants",
        copyrigths: [
            "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
        ]
    },
    {
        name: "expo-device",
        copyrigths: [
            "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
        ]
    },
    {
        name: "expo-font",
        copyrigths: [
            "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
        ]
    },
    {
        name: "expo-mail-composer",
        copyrigths: [
            "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
        ]
    },
    {
        name: "expo-splash-screen",
        copyrigths: [
            "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
        ]
    },
    {
        name: "expo-web-browser",
        copyrigths: [
            "Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)"
        ]
    },
    {
        name: "moment",
        copyrigths: [
            "Copyright (c) JS Foundation and other contributors"
        ]
    },
    {
        name: "react",
        copyrigths: [
            "Copyright (c) Facebook, Inc. and its affiliates."
        ]
    },
    {
        name: "react-devtools",
        copyrigths: [
            "Copyright (c) Facebook, Inc. and its affiliates."
        ]
    },
    {
        name: "react-dom",
        copyrigths: [
            "Copyright (c) Facebook, Inc. and its affiliates."
        ]
    },
    {
        name: "react-native",
        copyrigths: [
            "Copyright (c) Facebook, Inc. and its affiliates."
        ]
    },
    {
        name: "react-native-animatable",
        copyrigths: [
            "Copyright (c) 2015 Joel Arvidsson"
        ]
    },
    {
        name: "react-native-appearance",
        copyrigths: [
            "Copyright (c) Facebook, Inc. and its affiliates."
        ]
    },
    {
        name: "react-native-gesture-handler",
        copyrigths: [
            "Copyright (c) 2016 Krzysztof Magiera"
        ]
    },
    {
        name: "react-native-safe-area-context",
        copyrigths: [
            "Copyright (c) 2019 Th3rd Wave"
        ]
    },
    {
        name: "react-native-screens",
        copyrigths: [
            "Copyright (c) 2018 Krzysztof Magiera"
        ]
    },
    {
        name: "react-native-svg",
        copyrigths: [
            "Copyright (c) [2015-2016] [Horcrux]"
        ]
    },
    {
        name: "react-native-webview",
        copyrigths: [
            "Copyright (c) 2015-present, Facebook, Inc."
        ]
    },
    {
        name: "react-navigation-header-buttons",
        copyrigths: [
            "Copyright (c) 2018 Vojtech Novak"
        ]
    },
    {
        name: "react-redux",
        copyrigths: [
            "Copyright (c) 2015-present Dan Abramov"
        ]
    },
    {
        name: "redux",
        copyrigths: [
            "Copyright (c) 2015-present Dan Abramov"
        ]
    },
    {
        name: "redux-thunk",
        copyrigths: [
            "Copyright (c) 2015-present Dan Abramov"
        ]
    }
]

const LicenseListViewItem = (props) => {
    const { colorTheme } = useThemeProvider()

    return (
        <View style={{ ...styles.license, backgroundColor: colorTheme.componentBackground }}>
            <View>
                <HeadingText style={styles.name}>{props.name}</HeadingText>
                {(props?.copyrigths ?? []).map((c) => {
                    return <ContentText>{c}</ContentText>
                })}
            </View>
        </View >
    )
}

const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };

const LicenseScreen = (props) => {
    const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape')
    const [isTablet, setIsTablet] = useState(Platform.isPad)

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

    const numCols = (isTablet || orientation == 'landscape') ? 2 : 1

    return (
        <RootView style={styles.container}>
            <FlatList
              key={'cols_' + numCols} //Need to change the key aswell, because an on the fly update of numColumns is not supported and a full rerender is necessary
              numColumns={numCols}
                ListHeaderComponent={
                    <InformationCard title="Unter der MIT Lizenz">
                        <InformationText>
                            Permission is hereby granted, free of charge, to any person obtaining a copy
                            of this software and associated documentation files (the "Software"), to deal
                            in the Software without restriction, including without limitation the rights
                            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                            copies of the Software, and to permit persons to whom the Software is
                            furnished to do so, subject to the following conditions:
                            </InformationText>
                        <LineBreak numOfBreaks={2} />
                        <InformationText>
                            The above copyright notice and this permission notice shall be included in all
                            copies or substantial portions of the Software.
                            </InformationText>
                        <LineBreak numOfBreaks={2} />
                        <InformationText>
                            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                            SOFTWARE.
                        </InformationText>
                    </InformationCard>
                }
                ListHeaderComponentStyle={styles.heading}
                data={licenses}
                renderItem={({ item }) => (
                    <LicenseListViewItem
                        name={item.name}
                        copyrigths={item.copyrigths}
                    />
                )}
                keyExtractor={item => item.name}
            />
        </RootView>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 4
    },
    license: {
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 4,
        paddingBottom: 8,

        borderRadius: Layout.borderRadius,
        borderColor: Layout.borderColor,
        borderWidth: Layout.borderWidth,
        margin: 4
    },
    name: {
        marginBottom: 4
    },
    heading: {
        margin: 4
    }
})

export default LicenseScreen
