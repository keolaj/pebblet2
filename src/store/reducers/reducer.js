const initialState = {
	user: null,
	redirectTo: null
}

export const reducer = (state = initialState, action) => {
	switch(action.type) {
		case "SET_USER":
			return {
				...state,
				user: action.payload
			}
		case "SET_REDIRECT_TO":
			return {
				...state,
				redirectTo: action.payload
			}
		default:
			return {...state}
	}
}