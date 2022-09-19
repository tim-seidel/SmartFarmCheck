import React from 'react'
import { FlashList } from '@shopify/flash-list'

import MeasureListItemView from '../components/MeasureListItemView'

function MeasureListView(props) {
	return (
		<FlashList
			key={'col' + props.columns} //Need to change the key aswell, because an on the fly update of numColumns is not supported and a full rerender is necessary
            estimatedItemSize={200}
			numColumns={props.columns ?? 1}
			ListHeaderComponent={props.header}
			data={props.measures}
			renderItem={({ item }) => (
				<MeasureListItemView
					style={props.itemStyle}
					key={item.uuid}
					title={item.name}
					short={item.excerpt}
                    keywords={item.keywords}
					measureSelected={() => { if (props.measureSelected) props.measureSelected(item) }}
				/>
			)}
			keyExtractor={item => item.uuid}
		/>
	)
}

export default MeasureListView
