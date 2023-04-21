import React from 'react'

import { FlashList } from '@shopify/flash-list';

import EvaluationListItemView from '../components/EvaluationListItemView';

function EvaluationListView(props) {
	return (
		<FlashList
			key={'col' + props.columns} //Need to change the key aswell, because an on the fly update of numColumns is not supported and a full rerender is necessary
            estimatedItemSize={100}
            numColumns={props.columns ?? 1}
			ListHeaderComponent={props.header}
			data={props.ratings}
			renderItem={({ item }) => (
				<EvaluationListItemView
					key={item.uuid}
					style={props.itemStyle}
					title={item.name}
					short={item.excerpt}
					rating={item.rating}
					ratingSelected={() => { if (props.ratingSelected) props.ratingSelected(item) }}
				/>
			)}
			keyExtractor={item => item.uuid}
		/>
	)
}

export default EvaluationListView
