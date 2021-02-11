import Evaluation from "../../models/Evaluation"
import Rating from "../../models/Rating"

export const SET_EVALUATION = 'SET_EVALUATION'

export const fetchEvaluation = (input) => {
    return async dispatch => {

        const response = await fetch('https://pas.coala.digital/v1/evaluate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
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

        ratings.forEach(r => {
            r.weighted = Math.round((r.rating/maxRating + Number.EPSILON) * 100)
        })

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