const axios = require('axios');

export const getUser = () => {
	return dispatch => {
		axios({
			method: 'get',
			url: '/user/',
			responseType: 'json'
		}).then(res => {
			console.log('get user res: ' + JSON.stringify(res));

			if (res.data.user) {
				console.log('get user: there is a user saved in the server session');
				dispatch(updateUser(res.data.user))
			} else {
				console.log('get user: no user');
				dispatch(updateUser(null))
			}
		})
	}
}

export const updateUser = (user) => {
	return {
		type: 'SET_USER',
		payload: user
	}
}

export const loginUser = (username, password) => {
	return dispatch => {
		axios.post('/user/login', {
				username: username,
				password: password
			}, {withCredentials:true})
			.then(res => {
				console.log('login res: ' + JSON.stringify(res.data.user));
				if (res.status === 200) {
					dispatch(updateUser(res.data.user));
					dispatch(setRedirectTo('/'));
					dispatch(setRedirectTo(null))
				}
			})
			.catch(err => {
				console.log('login error: ' + err);
			})
	}
}

export const setRedirectTo = (url) => {
	return {
		type: 'SET_REDIRECT_TO',
		payload: url
	}
}

export const logoutUser = () => {
	return dispatch => {
		axios
			.post('/user/logout')
			.then(response => {
				console.log(response.data)
				if (response.status === 200) {
					dispatch(updateUser(null))
				}
			})
			.catch(error => {
				console.log('Logout error')
				console.error(error);
			})
	}
}