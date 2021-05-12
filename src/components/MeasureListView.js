import React from 'react'
import { StyleSheet, View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';

import MeasureListItemView from '../components/MeasureListItemView';

function MeasureListView(props) {
    return (
        <FlatList
            key={'col' + props.columns} //Need to change the key aswell, because an on the fly update of numColumns is not supported and a full rerender is necessary
            numColumns={props.columns ?? 1}
            style={props.style}
            ListHeaderComponent={
                <View>
                    {props.children}
                </View>}
            data={props.measures}
            renderItem={({ item }) => (
                <MeasureListItemView
                    style={styles.measureColumn}
                    key={item.uuid}
                    title={item.name}
                    short={item.excerpt}
                    measureSelected={() => { if (props.measureSelected) props.measureSelected(item) }}
                />
            )}
            keyExtractor={item => item.uuid}
        />
    )
}

const styles = StyleSheet.create({
    measureColumn: {
        flex: 1,
        marginTop: 8
    },
})

export default MeasureListView
