import React from 'react'
import { View } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';

import EvaluationListItemView from '../components/EvaluationListItemView';

function EvaluationListView(props) {
    return (
        <FlatList
            key={'col' + props.columns} //Need to change the key aswell, because an on the fly update of numColumns is not supported and a full rerender is necessary
            numColumns={props.columns ?? 1}
            style={props.style}
            ListHeaderComponent={
                <View>
                    {props.children}
                </View>}
            data={props.ratings}
            renderItem={({ item }) => (
                <EvaluationListItemView
                    key={item.uuid}
                    title={item.name}
                    short={item.excerpt}
                    rating={item.weighted}
                    ratingSelected={() => { if (props.ratingSelected) props.ratingSelected(item) }}
                />
            )}
            keyExtractor={item => item.uuid}
        />
    )
}

export default EvaluationListView
