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
            measure = new Measure(
                m.uuid,
                m.name,
                m.excerpt,
                m.description,
                m.resources
            )
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