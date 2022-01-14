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
            const measure = measures.find(m => m.uuid = r.uuid)
            const maxRating = measure ? measure.maxRating : 0

            let rating = r.rating/(maxRating*(answers.length/questions.length))
            rating = Math.min(100, Math.ceil(rating*100))

            ratings.push(new Rating(
				r.uuid,
				r.name,
				r.excerpt,
				rating
			))

            console.log("Rating " + r.name + ": " + rating)
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
