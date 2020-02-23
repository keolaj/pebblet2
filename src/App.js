import React from 'react';
import './App.css';
import './components/signUp';
import SignUp from './components/signUp';
import Login from './components/login';
import Home from './components/home';
import Upload from './components/upload';
import User from './components/user'
import { Route, Link, Redirect } from 'react-router-dom';

const axios = require('axios');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn: false,
			user: null,
			redirectTo: ''
		}
		this.componentDidMount.bind(this);
		this.updateUser.bind(this);
		this.getUser.bind(this);
	}
	componentDidMount() {
		this.getUser();
		console.log("component did mount state: " + JSON.stringify(this.state));
	}
	getUser = () => {
		axios({
			method: 'get',
			url: '/user/',
			responseType: 'json'
		})
			.then(res => {
				console.log('get user res: ' + JSON.stringify(res));

				if (res.data.user) {
					console.log('get user: there is a user saved in the server session');
					this.setState({
						isLoggedIn: true,
						user: res.data.user
					})
				} else {
					console.log('get user: no user');
					this.setState({
						isLoggedIn: false,
						user: null
					})
				}
		})
	}
	updateUser = (userObject) => {
		this.setState(userObject);
	}
	logout = (event) => {
        event.preventDefault()
        console.log('logging out')
        axios.post('/user/logout').then(response => {
          console.log(response.data)
          if (response.status === 200) {
            this.updateUser({
              loggedIn: false,
              user: null
            })
          }
        }).catch(error => {
			console.log('Logout error')
			console.error(error);
        })
    }
	render() {
			return (
				<div>
					{this.state.redirectTo ? <Redirect to={this.state.redirectTo} /> : null}
					{this.state.user ? (
						<div>
						<p>Welcome, {this.state.user.username}, you are logged in</p>
						<div style={{width:100, height:100}} onClick={this.logout}>log out</div>
					</div>
					) : null}	
					<Route path="/" exact component={Home} />
					<Route path="/login" render={() => {
						return(<Login 
							updateUser={this.updateUser}
							user={this.state.user}
						/>)
					}}/>
					<Route path="/signup" component={SignUp} />
					<Route path="/upload" render={() => {
						return(<Upload user={this.state.user}/>)
					}}/>
					<Route path='/users/:username' component={User} />
				</div>
			)
		}
}


export default App;
