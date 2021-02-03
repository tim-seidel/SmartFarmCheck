const { SET_QUESTIONS } = require("../actions/questions")

const initialState = {
    questions : []
}

const questionsReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_QUESTIONS: {
            return {
                ...state,
                questions: action.questions
            }
        }
        default: {
            return state
        }
    }
}

export default questionsReducer
