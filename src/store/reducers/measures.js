import { SET_MEASURES } from "../actions/measures"

const initialState = {
    measures: []
}

const measuresReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MEASURES:
            return {
                ...state,
                measures: action.measures
            }
        default:
            return state;
    }
}

export default measuresReducer
