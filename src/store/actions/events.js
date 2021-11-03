import moment from "moment"

import Event from "../../models/Event"
import Network from "../../constants/Network"
import { fetchWithTimeout } from "../../network/network"
import API from "../../constants/API"

export const SET_EVENTS = "SET_EVENTS"
export const UPDATE_EVENT = "UPDATE_EVENT"

export const fetchEvents = () => {
	return async dispatch => {
		const response = await fetchWithTimeout(`${API.URL}/${API.VERSION}/events`, Network.requestTimeout, {
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
		})

		if (!response.ok) {
			throw { status: response.status, statusText: response.statusText }
		}

		const json = await response.json()
		const events = []

		json.forEach(e => {
			events.push(new Event(
				e.uuid,
				e.title,
				e.description,
				new Date(e.startDate),
				new Date(e.endDate),
				e.link,
				e.image,
				e.maxParticipantCount ?? 0
			))
		})

		events.sort(function (e1, e2) {
			return e1.startDate - e2.startDate
		})

		dispatch({
			type: SET_EVENTS,
			events: events ?? [],
			updateTime: moment().unix()
		})
	}
}

export const fetchEvent = (id) => {
	return async dispatch => {
		const response = await fetchWithTimeout(`${API.URL}/${API.VERSION}/events/${id}`, Network.requestTimeout, {
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
			type: UPDATE_EVENT,
			eventId: json.uuid,
			eventData: json,
		})
	}
}
