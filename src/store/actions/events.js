import Event from "../../models/Event"
import eventMock from "../../data/Events"

export const SET_EVENTS = "SET_EVENTS"

export const fetchEvents = () => {
    return async dispatch => {
        /*
        const response = await fetch('https://pas.coala.digital/v1/events', {
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
                e.name,
                e.excerpt,
                new Date(e.startDate),
                new Date(e.endDate),
                e.url
            ))
        })
        */

        const events = eventMock
        console.log(events)

        events.sort(function (e1, e2) {
            return e1 - e2
        })

        dispatch({
            type: SET_EVENTS,
            events: events ?? []
        })
    }
}
