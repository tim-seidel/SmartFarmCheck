import { SET_EVALUATION, SET_EVALUATION_CONTACT_REQUEST } from "../actions/evaluation"

const initialState = {
    evaluation: undefined,
    contactRequest: undefined,
}

const evaluationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_EVALUATION:
            return {
                ...state,
                evaluation: action.evaluation
            }
        case SET_EVALUATION_CONTACT_REQUEST: {
            return {
                ...state,
                contactRequest: action.contactRequest
            }
        }
        default:
            return state;
    }
}

export default evaluationReducer
