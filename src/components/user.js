import React from 'react';
const axios = require('axios')

class User extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user: {
				posts: [{}],
				data: {}
			}
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
				console.log(this.state)
				// axios.get(`/user/users/${this.props.match.params.username}/${this.state.user.posts[0].fileid}`)
				// 	.then((res2) => {
				// 		this.setState({
				// 			data: JSON.parse(res2)
				// 		})
				// 	})
			})
	}
	followUser = () => {
		axios.post(`/user/users/${this.props.match.params.username}/follow`)
			.then((res) => {
				console.log(res)
			})
	}
	render() {
		return (
			<div>
				<h1>user: {this.state.user.username}</h1>
				<h1 onClick={this.followUser}>follow</h1>
				{this.state.user.posts[0] ? <img src={`/user/users/${this.props.match.params.username}/${this.state.user.posts[0].fileid}`} /> : null}
			</div>
		)
	}
}
export default User;