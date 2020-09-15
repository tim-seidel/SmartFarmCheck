import { SUBMIT_FEEDBACK } from "../actions/feedback"

const initalState = {
    feedback : []
}

const feedbackReducer = (state = initalState, action) => {
    switch(action.type){
        case SUBMIT_FEEDBACK: {
            return {
                ...state, 
                feedback: state.feedback.concat(action.feedback)
            }
        }
    }
}

export default feedbackReducer