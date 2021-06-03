import { fetchWithTimeout } from "../../network/network"
import API from "../../constants/API"
import Network from "../../constants/Network"
import Evaluation from "../../models/Evaluation"
import Rating from "../../models/Rating"
import ContactRequest from '../../models/ContactRequest';

export const SET_EVALUATION = 'SET_EVALUATION'
export const SET_EVALUATION_CONTACT_REQUEST = "SET_EVALUATION_CONTACT_REQUEST"

export const fetchEvaluation = (formUuid, answers) => {
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

        let maxRating = 0;
        const ratings = []
        json.forEach(r => {
            maxRating = Math.max(maxRating, r.rating)
            ratings.push(new Rating(
                r.uuid,
                r.name,
                r.excerpt,
                r.rating
            ))
        });

        //Norm the ratings and format them in percent
        ratings.forEach(r => {
            r.weighted = Math.round((r.rating / maxRating + Number.EPSILON) * 100)
        })

        //Sort the ratings (descending)
        ratings.sort(function (l, r) {
            return l - r
        })

        dispatch({
            type: SET_EVALUATION,
            evaluation: new Evaluation(answers, ratings)
        })
    }
}

export const evaluationToContact = (formUuid, answers, email) => {
    return async dispatch => {
        console.log("Contact", `${API.URL}/${API.VERSION}/contactRequest/${formUuid}?withContext=true`, answers)
        
        const response = await fetchWithTimeout(`${API.URL}/${API.VERSION}/contactRequest/${formUuid}?withContext=true`, Network.requestTimeout, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': '*/*',
            },
            body: JSON.stringify({
                answers:   answers,
                email: "dev@timseidel.de"
            })
        })

        console.log(response.status)
        if (!response.ok) {
            throw { status: response.status, statusText: response.statusText }
        }

        dispatch({
            type: SET_EVALUATION_CONTACT_REQUEST,
            contactRequest: new ContactRequest(formUuid, answers, email, response.status)
        })
        
    }
}
