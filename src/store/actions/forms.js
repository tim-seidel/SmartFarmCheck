import Network from "../../constants/Network"
import Form from "../../models/Form"
import { fetchWithTimeout } from "../../network/network"
import API from "../../constants/API"

export const SET_FORMS = 'SET_FORMS'
export const UPDATE_FORM = 'UPDATE_FORM'

export const fetchForms = () => {
    return async dispatch => {
        const response = await fetchWithTimeout(`${API.URL}/${API.VERSION}/forms`, Network.requestTimeout, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })

        if (!response.ok) {
            throw { status: response.status, statusText: response.statusText }
        }

        const json = await response.json()
        const forms = []

        json.forEach(f => {
            forms.push(new Form(
                f.uuid,
                f.title,
                f.description,
                f.icon
            ))
        });

        //Always sort the forms alphabetically, because they have no serverside sorting
        forms.sort(function (l, r) {
            if (l.title < r.title) return -1
            else if (l.title > r.title) return 1
            else return 0
        })

        dispatch({
            type: SET_FORMS,
            forms: forms ?? []
        })
    }
}

export const fetchForm = (id) => {
    return async dispatch => {
        const response = await fetchWithTimeout(`${API.URL}/${API.VERSION}/forms/${id}`, Network.requestTimeout, {
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
            type: UPDATE_FORM,
            formId: json.uuid,
            formData: json
        })
    }
}
