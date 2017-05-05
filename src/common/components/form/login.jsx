import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';

class LogInForm extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            newName: '',
            password: ''
        };
    }

    onFormSubmit(event) {
        event.preventDefault();

        this.props.onChangeName(this.state.newName);
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
                <form onSubmit={this.onFormSubmit.bind(this)}>
                    <label>User Name:</label>
                    <input type="text" name="user" placeholder="user" value={this.state.newName} onChange={this.onNameChange.bind(this)}/>
                    <br />
                    <label>Password:</label>
                    <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onPasswordChange.bind(this)}/>
                    <br />
                    <button type="submit">Log In</button>
                </form>
            </div>
        );
    }
}

LogInForm.PropTypes = {
    user: PropTypes.string
}

export default LogInForm;
