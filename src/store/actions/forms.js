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
				f.icon,
				f.hidden
			))
		});

		//Always sort the forms alphabetically, because they have no serverside sorting. Hidden forms are placed at the end.
        try{
		forms.sort(function (l, r) {
            if(l.hidden != r.hidden) return l.hidden ? 1 : -1
			else return ('' + l.title).localeCompare(r.title)
		})
    }catch(e){
        console.error(e)
    }

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
