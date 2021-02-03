import Video from "../../models/Video"
import mediaLibrary from "../../data/MediaLibrary"

export const SET_MEDIALIBRARY = "SET_MEDIALIBRARY"

export const fetchMediaLibrary = () => {
    return async dispatch => {
        /*
        const response = await fetch('https://pas.coala.digital/v1/mediaLibrary', {
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
                new Date(e.releaseDate)
                e.thumbnailUrl,
                e.url
            ))
        })
        */

        dispatch({
            type: SET_MEDIALIBRARY,
            mediaLibrary: mediaLibrary ?? []
        })
    }
}
