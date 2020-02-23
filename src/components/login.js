import React from 'react';
import { Redirect } from 'react-router-dom';
const axios = require('axios');

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			redirectTo: ''
		}
	}
	onInputHandler = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	onLoginHandler = (event) => {
		event.preventDefault();
		console.log('handlelogin')
		axios.post('/user/login',  {
			username: this.state.username,
			password: this.state.password
		})
		.then(res => {
			console.log('login res: ' + JSON.stringify(res));
			if (res.status === 200) {
				this.props.updateUser({
					loggedIn: true,
					user: res.data.user
				})
				this.setState({
					redirectTo: '/'
				})
			}
		})
		.catch(err => {
			console.log('login error: ' + err);
		})
	}
	render() {
		if (this.state.redirectTo) {
			return <Redirect to={this.state.redirectTo} />
		} else {
			return (
				<div>
					<h1>Login</h1>
					<input type='text' name='username' placeholder={'username'} value={this.state.username} onChange={this.onInputHandler}/>
					<input type='text' name='password' placeholder={'password'} value={this.state.password} onChange={this.onInputHandler}/>
					<div style={{width:100, height:100}} onClick={this.onLoginHandler}>submit</div>
				</div>
			)
		}
	}
}
export default Login;