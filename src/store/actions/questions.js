import AsyncStorage from '@react-native-async-storage/async-storage'

import { fetchWithTimeout } from '../../network/network'
import { getValidation } from '../../models/Validation'
import Network from "../../constants/Network"
import Keys from "../../constants/Keys"
import Question from "../../models/Question"
import Validator from "../../models/Validator"
import API from "../../constants/API"

export const SET_QUESTIONS = "SET_QUESTIONS"

export const fetchQuestions = (formUuid) => {
	return async dispatch => {
		const response = await fetchWithTimeout(`${API.URL}/${API.VERSION}/questions?parentFormId=${formUuid}`, Network.requestTimeout, {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		})

		if (!response.ok) {
			throw { status: response.status, statusText: response.statusText }
		}

		const json = await response.json()
		const questions = []
		json.forEach(q => {
			try {
				questions.push(new Question(
					q.uuid,
					q.text,
					q.description,
					new Validator(
						q.validator.uuid,
						q.validator.inputType,
						q.validator.pattern,
						q.validator.minLength,
						q.validator.maxLength,
						q.validator.min,
						q.validator.max,
						q.validator.options,
						q.validator.repeatable,
						q.validator.unit
					),
					q.formPriority
				))
			} catch (e) {
				//Skip this question
				console.log("Error parsing question", q, e)
			}
		})

		//Arrange the questions in the correct order
		questions.sort(function (q1, q2) {
			return q1.formPriority - q2.formPriority
		})

		//Check for stored question input and prefill & validate it 
		for (var i = 0; i < questions.length; i++) {
			const q = questions[i]
			const value = await AsyncStorage.getItem(Keys.PREFILL_PREFIX + q.uuid)
			q.input = value ?? ''

			if (value) {
				const validation = getValidation(q.validator)
				const { validity } = validation(q.validator, q.input)
				q.validity = validity
			}
		}

		dispatch({
			type: SET_QUESTIONS,
			questions: questions ?? []
		})
	}
}
