import moment from "moment"

const Network = {
    requestTimeout: 1000 * 10,
    UPDATE_MEASURE_THRESHOLD: 1000 * 60 * 60 * 2,
    UPDATE_MEDIALIBRARY_THRESHOLD: 60 * 60,
    UPDATE_EVENTS_THRESHOLD: 60 * 5
}

export function shouldUpate(lastUpdated, updateThreshold) {
    const diff = moment().unix() - lastUpdated
    return diff > updateThreshold
}

export default Network