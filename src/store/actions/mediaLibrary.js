import moment from "moment"

import Video from "../../models/Video"
import Network from "../../constants/Network"
import { fetchWithTimeout } from "../../network/network"
import API from "../../constants/API"

export const SET_MEDIALIBRARY = "SET_MEDIALIBRARY"

export const fetchMediaLibrary = () => {
    return async dispatch => {
        const response = await fetchWithTimeout(`${API.URL}/${API.VERSION}/videos/info`, Network.requestTimeout, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })

        if (!response.ok) {
            throw { status: response.status, statusText: response.statusText }
        }

        const json = await response.json()
        const mediaLibrary = []

        json.forEach(e => {
            mediaLibrary.push(new Video(
                e.uuid,
                e.title,
                e.description,
                new Date(e.publishingDate),
                e.thumbnail,
                e.videoLink
            ))
        })

        //Always sort the media items alphabetically, because they have no serverside sorting
        mediaLibrary.sort(function (l, r) {
            if (l.title < r.title) return -1
            else if (l.title > r.title) return 1
            else return 0
        })

        dispatch({
            type: SET_MEDIALIBRARY,
            mediaLibrary: mediaLibrary ?? [],
            updateTime: moment().unix()
        })
    }
}
