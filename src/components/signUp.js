import React from 'react';
const axios = require('axios');

class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			email: ''
		}
	}
	handleOnChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}
	handleSubmit = (event) => {
		event.preventDefault();
		console.log('sign up, username: ' + this.state.username);

		axios.post('/user/', {
			username: this.state.username,
			password: this.state.password,
			email: this.state.email
		})
			.then((res, err) => {
				console.log(res);
				if (res.data.error) {
					console.log('error: ' + res.data.error);
					
				} else {
					console.log('successful sign up')
					this.setState({
						redirectTo: '/login'
					})
				}
			})
			.catch(err => console.log('sign up server error: ' + err));
	}
	render() {
		return (
			<div>
				<input type='text' name='username' onChange={this.handleOnChange} placeholder={'username'}/>
				<input type='text' name='password' onChange={this.handleOnChange} placeholder={'password'}/>
				<input type='text' name='email' onChange={this.handleOnChange} placeholder={'email'} />
				<div style={{'width': 100, 'height': 100}} onClick={this.handleSubmit}>
					submit
				</div>
			</div>
		)
	}
}

export default SignUp;