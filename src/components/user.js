import React from 'react';
const axios = require('axios')

class User extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user: {}
		}
	}
	componentDidMount() {
		console.log("props: " + JSON.stringify(this.props.match.params.username))
		axios.get(`/user/users/${this.props.match.params.username}`)
			.then((res) => {
				console.log("testing user res: " + JSON.stringify(res))
				this.setState({
					user: res.data.user
				})
			})
	}
	render() {
		return (
		<h1>user: {this.state.user.username}</h1>
		)
	}
}
export default User;