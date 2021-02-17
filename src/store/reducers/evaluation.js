import Evaluation from "../../models/Evaluation"
import { SET_EVALUATION } from "../actions/evaluation"

const initialState = {
    evaluation: new Evaluation()
}

const evaluationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_EVALUATION:
            return {
                ...state,
                evaluation: action.evaluation
            }
        default:
            return state;
    }
}

export default evaluationReducer
