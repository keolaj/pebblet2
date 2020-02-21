import React from 'react';
import './App.css';
import './components/signUp';
import SignUp from './components/signUp';
import Login from './components/login';
import Home from './components/home';
import { Route, Link } from 'react-router-dom';

const axios = require('axios');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			username: null
		}
		this.componentDidMount.bind(this);
		this.updateUser.bind(this);
		this.getUser.bind(this);
	}
	componentDidMount() {
		this.getUser();
	}
	getUser = () => {
		axios.get('/user.')
			.then(res => {
				console.log('get user res: ' + res);

				if (res.data.user) {
					console.log('get user: there is a user saved in the server session');
					this.setState({
						loggedIn: true,
						username: res.data.user.username
					})
				} else {
					console.log('get user: no user');
					this.setState({
						loggedIn: false,
						username: null
					})
				}
		})
	}
	updateUser = (userObject) => {
		this.setState(userObject);
	}
	render() {
		return (
			<div>
				{this.state.loggedIn ? <p>Welcome, {this.state.username}</p> : null}
				<Route path="/" exact component={Home} />
				<Route path="/login" render={() => 
					<Login updateUser={this.updateUser}/>
				}
				/>
			</div>
		)
	}
}


export default App;
