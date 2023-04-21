import { SET_MEDIALIBRARY } from "../actions/mediaLibrary";

const initialState = {
	all: [],
	updateTime: 0
}

const mediaLibraryReducer = (state = initialState, action) => {
	switch (action.type) {
		case SET_MEDIALIBRARY: {
			return {
				...state,
				all: action.mediaLibrary,
				updateTime: action.updateTime
			}
		}
		default: {
			return state
		}
	}
}

export default mediaLibraryReducer
