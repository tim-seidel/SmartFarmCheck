import Form from "../../models/Form"
import { SET_FORMS, UPDATE_FORM } from "../actions/forms"

const initialState = {
	forms: []
}

const formsReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_FORMS:
			return {
				...state,
				forms: action.forms
			}
		case UPDATE_FORM: {
			const form = new Form(
				action.formId,
				action.formData.title,
				action.formData.description,
			)

			const formIndex = state.forms.findIndex(m => m.uuid === action.formId)
			if (formIndex !== -1) {
				const updateMeasures = [...state.forms]
				updateMeasures[formIndex] = form
				return {
					...state,
					forms: updateMeasures
				}
			} else {
				return {
					...state,
					forms: state.forms.concat(form)
				}
			}
		}
		default:
			return state;
	}
}

export default formsReducer
