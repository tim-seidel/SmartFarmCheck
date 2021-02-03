import Measure from "../../models/Measure"

export const SET_MEASURES = 'SET_MEASURES'
export const UPDATE_MEASURE = 'UPDATE_MEASURE'

export const fetchMeasures = () => {
    return async dispatch => {

        const response = await fetch('https://pas.coala.digital/v1/measures', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })

        if (!response.ok) {
            throw { status: response.status, statusText: response.statusText }
        }

        const json = await response.json()
        const measures = []
        json.forEach(m => {
            measures.push(new Measure(
                m.uuid,
                m.name,
                m.excerpt,
                m.description,
                m.resources
            ))
        });

        //Always sort the measures alphabetically, because they have no serverside sroting
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

        const response = await fetch(`https://pas.coala.digital/v1/measures/${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })

        if (!response.ok) {
            throw { status: response.status, statusText: response.statusText }
        }

        const json = await response.json()

        dispatch({
            type: UPDATE_MEASURE,
            measureId: json.uuid,
            measureData: json
        })
    }
}