import { SET_ } from "../actions/events";
import { SET_MEDIALIBRARY } from "../actions/mediaLibrary";

const initialState = {
    all : [],
}

const mediaLibraryReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MEDIALIBRARY: {
            return {
                ...state,
                all: action.mediaLibrary,
            }
        }
        default: {
            return state
        }
    }
}

export default mediaLibraryReducer
