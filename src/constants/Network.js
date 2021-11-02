import moment from "moment"

const Network = {
    requestTimeout: 1000 * 10,
    UPDATE_MEASURE_THRESHOLD: 1000 * 60 * 60 * 2,
    UPDATE_MEDIALIBRARY_THRESHOLD: 60 * 60,
}

export function shouldUpate(lastUpdated, updateThreshold) {
    const diff = moment().unix() - lastUpdated
    return diff > updateThreshold
}

export default Network