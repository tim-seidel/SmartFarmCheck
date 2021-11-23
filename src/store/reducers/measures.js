import { SET_MEASURES, UPDATE_MEASURE } from "../actions/measures"
import Measure from "../../models/Measure"

const initialState = {
	measures: []
}

const measuresReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_MEASURES:
			return {
				...state,
				measures: action.measures
			}
		case UPDATE_MEASURE: {
			const measure = new Measure(
				action.measureId,
				action.measureData.name,
				action.measureData.excerpt,
				action.measureData.description,
                action.measureData.keywords,
				action.measureData.resources
			)
			measure.updateTime = action.measureData.updateTime

			const measureIndex = state.measures.findIndex(m => m.uuid === action.measureId)
			if (measureIndex !== -1) {
				const updateMeasures = [...state.measures]
				updateMeasures[measureIndex] = measure
				return {
					...state,
					measures: updateMeasures
				}
			} else {
				return {
					...state,
					measures: state.measures.concat(measure)
				}
			}
		}
		default:
			return state;
	}
}

export default measuresReducer
