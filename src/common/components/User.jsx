import React from 'react';

class User extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			username: '',
			password: '',
			loggedIn: false
		};
	}

	onFormSubmit(event) {
		event.preventDefault();

		this.setState({
			loggedIn: (this.state.username !== '' && this.state.password !== '')
		});

		console.log(this.state.loggedIn);
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

export default User;
