import Video from "../../models/Video"
import API from "../../constants/API"

export const SET_MEDIALIBRARY = "SET_MEDIALIBRARY"

export const fetchMediaLibrary = () => {
    return async dispatch => {
        const response = await fetch(`${API.URL}/${API.VERSION}/videos/info`, {
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

        console.log(mediaLibrary)


        dispatch({
            type: SET_MEDIALIBRARY,
            mediaLibrary: mediaLibrary ?? []
        })
    }
}
