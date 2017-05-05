import React from 'react';
import PropTypes from 'prop-types';

class User extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			username: '',
			password: ''
		};
	}

	onFormSubmit(event) {
		event.preventDefault();

		let isLoggedIn = (this.state.username !== '' && this.state.password !== '');

		this.props.updateUserStatus(isLoggedIn);
		
		if (window.localStorage.getItem('isLoggedIn') === null) {
			window.localStorage.setItem('isLoggedIn', isLoggedIn);
		}
	}

	onUsernameChange(event) {
		this.setState({
			username: event.target.value
		});
	}

	onPasswordChange(event) {
		this.setState({
			password: event.target.value
		});
	}

	render() {
		return (
			<div>
				<form onSubmit={this.onFormSubmit.bind(this)}>
					<label>Username:</label>
					<input type="text" name="username" placeholder="Username" value={this.state.username} onChange={this.onUsernameChange.bind(this)}/>
					
					<label>Password:</label>
					<input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onPasswordChange.bind(this)}/>
					<button type="submit">Log In</button>
				</form>
			</div>
		);
	}
}

User.PropTypes = {
	updateUserStatus: PropTypes.func
}

export default User;
