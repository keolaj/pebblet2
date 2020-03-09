import React from 'react';
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreator from '../store/actions/actionCreator';
const axios = require('axios');

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			redirectTo: ''
		}
		this.componentDidMount.bind(this)
	}
	componentDidMount() {
		if (this.props.user) {
			this.props.setRedirectTo('/');
		}
	}
	onInputHandler = (event) => {
		this.setState({
			[event.target.name]: event.target.value
		})
	}
	onLoginHandler = (event) => {
		event.preventDefault();
		console.log('handlelogin');
		this.props.loginUser(this.state.username, this.state.password)
	}
	render() {
		if (this.props.redirectTo) {
			return <Redirect to={this.props.redirectTo} />
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
const mapStateToProps = state => {
	return {
		user: state.user,
		redirectTo: state.redirectTo
	}
}
function mapDispatchToProps(dispatch) {
	return {
		loginUser: (username, password) => dispatch(actionCreator.loginUser(username, password)),
		setRedirectTo: (url) => dispatch(actionCreator.setRedirectTo(url))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);