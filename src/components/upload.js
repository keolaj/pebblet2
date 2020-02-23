import React from 'react'
const axios = require('axios')

class Upload extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			caption: ''
		}
	}
	onSubmitHandler = (event) => {
		event.preventDefault();
		let formdata = new FormData();
		formdata.append('file', this.fileUpload.files[0]);
		formdata.append('user', this.props.user);
		formdata.append('caption', this.state.caption);
		fetch('/user/upload', {
			method: 'POST',
			body: formdata
		})
		.then(res => console.log(res));
	}
	onChangeHandler = (event) => {
		this.setState({
			caption: event.target.value
		})
	}
	render() {
		console.log(this.props.user)
		return (
			<div>
				<div style={{width:100, height:100, backgroundColor: 'black'}}>
					<input type='file' name='file' ref={(ref) => this.fileUpload = ref}></input>
					<input type='text' name='caption' onChange={this.onChangeHandler} placeholder='caption' />
				</div>
				<div style={{width:100, height:100}} onClick={this.onSubmitHandler}>submit</div>
			</div>
		)
	}
}
export default Upload;