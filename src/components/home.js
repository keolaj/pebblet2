import React from 'react';
import { Link } from 'react-router-dom'
const axios = require('axios')

class Home extends React.Component {
	render() {
		return (
			<div>
				<p>You are at Home</p>
				<Link to='/upload'>upload</Link>

				<button onClick={() => {
					axios.get('/user/feed/0').then(res => {
						console.log('feed res: ' + JSON.stringify(res.data.feed))
					})
				}}>Get feed</button>
			</div>
		)
	}
}
export default Home;