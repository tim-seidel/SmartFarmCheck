import { SET_EVENTS } from "../actions/events";

const initialState = {
    events : [],
    comming: []
}

const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_EVENTS: {
            const now = Date.now()
            const cmg = []
            action.events.forEach(e => {
                if(now < e.endDate.getTime()){
                    cmg.push(e)
                }
            });
            return {
                ...state,
                events: action.events,
                comming: cmg
            }
        }
        default: {
            return state
        }
    }
}

export default eventReducer
