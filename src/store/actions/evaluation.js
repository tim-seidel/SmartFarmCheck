import Evaluation from "../../models/Evaluation"
import Rating from "../../models/Rating"
import { fetchWithTimeout } from "../../network/network"
import API from "../../constants/API"
import Network from "../../constants/Network"

export const SET_EVALUATION = 'SET_EVALUATION'

export const fetchEvaluation = (input, formUuid) => {
    return async dispatch => {
        console.log("PDF", `${API.URL}/${API.VERSION}/evaluate/pdf/${formUuid}`, input)
        const response = await fetchWithTimeout(`${API.URL}/${API.VERSION}/evaluate`, Network.requestTimeout, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: input
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
            evaluation: new Evaluation(input, ratings)
        })
    }
}

export default fetchEvaluation