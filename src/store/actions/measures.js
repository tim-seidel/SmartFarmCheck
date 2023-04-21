import Network from "../../constants/Network"
import Measure from "../../models/Measure"
import { fetchWithTimeout } from "../../network/network"
import API from "../../constants/API"

export const SET_MEASURES = 'SET_MEASURES'
export const UPDATE_MEASURE = 'UPDATE_MEASURE'

export const fetchMeasures = () => {
	return async dispatch => {
		const response = await fetchWithTimeout(`${API.URL}/${API.VERSION}/measures`, Network.requestTimeout, {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		})

		if (!response.ok) {
			throw { status: response.status, statusText: response.statusText }
		}

		const json = await response.json()
		const measures = []
		json.forEach(m => {
			const measure = new Measure(
				m.uuid,
				m.name,
				m.excerpt,
				m.description,
				m.keywords,
				m.resources
			)

			const forms = {}
			const ratings = {}

			//Iterate over all rules. Store the max rating for each value
			//And also keep track of all forms and their questions
			m.rules.forEach(rule => {
				questionId = rule.question.uuid
				formId = rule.question.parentForm

				if (!(formId in ratings)) {
					ratings[formId] = {}
					ratings[formId][questionId] = rule.rating

					forms[formId] = {
						id: formId,
						maxRating: 0,
						questions: [questionId]
					}
				} else {
					if (!(questionId in ratings[formId])) {
						ratings[formId][questionId] = rule.rating
						forms[formId].questions.push(questionId)
					} else {
						if (ratings[formId][questionId] < rule.rating) {
							ratings[formId][questionId] = rule.rating
						}
					}
				}
			})

			//Calculate the maximum possible rating value for each measure per form
			for (const formId in ratings) {
				const formRating = ratings[formId]
				let max = 0
				for (const rating in formRating) {
					max += formRating[rating]
				}
				forms[formId].maxRating = max
			}

			measure.forms = forms
			measure.updateTime = Date.now()

			measures.push(measure)
		});

		//Always sort the measures alphabetically, because they have no serverside sorting
		measures.sort(function (l, r) {
			if (l.name < r.name) return -1
			else if (l.name > r.name) return 1
			else return 0
		})

		dispatch({
			type: SET_MEASURES,
			measures: measures ?? []
		})
	}
}

export const fetchMeasure = (id) => {
	return async dispatch => {
		const response = await fetchWithTimeout(`${API.URL}/${API.VERSION}/measures/${id}`, Network.requestTimeout, {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		})

		if (!response.ok) {
			throw { status: response.status, statusText: response.statusText }
		}

		const json = await response.json()
		json.updateTime = Date.now()

		dispatch({
			type: UPDATE_MEASURE,
			measureId: json.uuid,
			measureData: json
		})
	}
}
