import React from 'react';
import './App.css';
import './components/signUp';
import SignUp from './components/signUp';
import Login from './components/login';
import Home from './components/home';
import Upload from './components/upload';
import User from './components/user'
import {Route, Link, Redirect} from 'react-router-dom';
import * as actionCreator from './store/actions/actionCreator';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'

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
    }
    componentDidMount() {
		console.log("component did mount state: " + JSON.stringify(this.state));
		this.props.getUser();
    }
    logout = (event) => {
        event.preventDefault()
		console.log('logging out')
		this.props.logoutUser();
    }
    render() {
        return (
            <div>
                {this.state.redirectTo
                    ? <Redirect to={this.state.redirectTo}/>
                    : null}
                {this.props.user
                    ? (
                        <div>
                            <p>Welcome, {this.props.user.username}, you are logged in</p>
                            <div
                                style={{
                                width: 100,
                                height: 100
                            }}
                                onClick={this.logout}>log out</div>
                        </div>
                    )
                    : null}
                <Route path="/" exact component={Home}/>
                <Route
                    path="/login"
                    render={() => {
                    return (<Login user={this.props.user}/>)
                }}/>
                <Route path="/signup" component={SignUp}/>
                <Route
                    path="/upload"
                    render={() => {
                    return (<Upload user={this.state.user}/>)
                }}/>
                <Route path='/users/:username' component={User}/>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {user: state.user}
}
const mapDispatchToProps = dispatch => {
    return {
		getUser: () => dispatch(actionCreator.getUser()),
		updateUser: user => dispatch(actionCreator.updateUser(user)),
		logoutUser: () => dispatch(actionCreator.logoutUser())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
