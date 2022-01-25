import { fetchWithTimeout } from "../../network/network"
import API from "../../constants/API"
import Network from "../../constants/Network"
import Evaluation from "../../models/Evaluation"
import Rating from "../../models/Rating"
import ContactRequest from '../../models/ContactRequest';

export const SET_EVALUATION = 'SET_EVALUATION'
export const SET_EVALUATION_CONTACT_REQUEST = "SET_EVALUATION_CONTACT_REQUEST"

export const fetchEvaluation = (formUuid, questions, answers, measures) => {
	return async dispatch => {
		const response = await fetchWithTimeout(`${API.URL}/${API.VERSION}/evaluate`, Network.requestTimeout, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'accept': 'application/json',
			},
			body: JSON.stringify(answers)
		})

		if (!response.ok) {
			throw { status: response.status, statusText: response.statusText }
		}

		const json = await response.json()

		const ratings = []
		json.forEach(r => {
			const measure = measures.find(m => m.uuid == r.uuid)
			const formStatistics = measure && measure.forms[formUuid] ? measure.forms[formUuid] : { id: formUuid, questions: [], maxRating: 0 }

			const maxRating = formStatistics.maxRating
			const questionsInForm = formStatistics.questions.length

			let answeredQuestionsOfForm = 0
			for (const a in answers) {
				if (formStatistics.questions.includes(answers[a].questionUUID)) {
					answeredQuestionsOfForm++
				}
			}

			let rating = 0
			let debug = ""
            if (questionsInForm > 0 && answeredQuestionsOfForm > 0) {
				const percentageAnswered = answeredQuestionsOfForm / questionsInForm
				rating = Math.min(100, Math.ceil((r.rating / (maxRating * percentageAnswered)) * 100))

                debug = `${r.rating} von ${maxRating} Punkten.\n${answeredQuestionsOfForm} von ${questionsInForm} beantwortete Fragen.\nBewertet: Einfach: ${Math.ceil(r.rating / maxRating * 100)}%, Gewichtet: ${rating}%`
				console.log(r.name, debug)
            }

			ratings.push(new Rating(
				r.uuid,
				r.name,
				r.excerpt,
				rating,
                debug
			))

			ratings.sort((l, r) => r.rating - l.rating)

		});

		dispatch({
			type: SET_EVALUATION,
			evaluation: new Evaluation(answers, ratings)
		})
	}
}

export const evaluationToContact = (formUuid, answers, email) => {
	return async dispatch => {

		const response = await fetchWithTimeout(`${API.URL}/${API.VERSION}/contactRequest/${formUuid}?withContext=true`, Network.requestTimeout * 2, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'accept': '*/*',
			},
			body: JSON.stringify({
				answers: answers,
				email: email
			})
		})

		if (!response.ok) {
			throw { status: response.status, statusText: response.statusText }
		}

		dispatch({
			type: SET_EVALUATION_CONTACT_REQUEST,
			contactRequest: new ContactRequest(formUuid, answers, email, response.status)
		})

	}
}
