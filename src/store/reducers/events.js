import moment from 'moment';

import { SET_EVENTS } from "../actions/events";

const initialState = {
	events: [],
	comming: [],
	previous: [],
	updateTime: 0
}

const eventReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_EVENTS: {
			const now = moment().subtract(1, 'd').hours(0).minutes(0) //Show them one day longer
			const cmg = []
			const prv = []
			action.events.forEach(e => {
				if (now.isBefore(e.startDate)) {
					cmg.push(e)
				} else {
					prv.push(e)
				}
			});
			return {
				...state,
				events: action.events,
				comming: cmg,
				previous: prv,
				updateTime: action.updateTime
			}
		}
		default: {
			return state
		}
	}
}

export default eventReducer
