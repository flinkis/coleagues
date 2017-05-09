import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

class UserLogin extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            newName: '',
            password: ''
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
    }

    onFormSubmit(event) {
        const {newName} = this.state;
        event.preventDefault();

        this.props.onChangeName(newName);
        this.setState({ newName: '' });
    }

    onNameChange(event) {
        this.setState({
            newName: event.target.value
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
                <form onSubmit={this.onFormSubmit}>
                    <label htmlFor="name">User Name:</label>
                    <input type="text" id="name" placeholder="User name" value={this.state.newName} onChange={this.onNameChange}/>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" placeholder="Password" value={this.state.password} onChange={this.onPasswordChange}/>
                    <button type="submit">Log In</button>
                </form>
            </div>
        );
    }
}

UserLogin.PropTypes = {
    onChangeName: PropTypes.func
}

export default UserLogin;
