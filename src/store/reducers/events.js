import { SET_EVENTS } from "../actions/events";

const initialState = {
    events : [],
    comming: [],
    previous: []

}

const eventReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_EVENTS: {
            const now = Date.now()
            const cmg = []
            const prv = []
            action.events.forEach(e => {
                if(now < e.endDate.getTime()){
                    cmg.push(e)
                }else{
                    prv.push(e)
                }
            });
            return {
                ...state,
                events: action.events,
                comming: cmg,
                previous: prv
            }
        }
        default: {
            return state
        }
    }
}

export default eventReducer
