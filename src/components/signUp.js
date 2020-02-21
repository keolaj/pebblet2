import React from 'react';
const axios = require('axios');

class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		}
	}
	handleOnChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		});
	}
	handleSubmit = (event) => {
		event.preventDefault();
		console.log('sign up, username: ' + this.state.username)
	}
	render() {
		return (
			<div>
				<input type='text' name='username' onChange={this.handleOnChange} />
				<div style={{'width': 100, 'height': 100}} onClick={this.handleSubmit}>
					submit
				</div>
			</div>
		)
	}
}

export default SignUp;