import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';

import styles from './style.css';

class UserLogin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                name: '',
                password: '',
            },
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }

    onFormSubmit(event) {
        const { user } = this.state;
        event.preventDefault();

        this.props.onLogin(user);
    }

    inputChange(label) {
        return (event) => {
            const { user } = this.state;
            user[label] = event.target.value;
            this.setState({ user });
        };
    }

    render() {
        const { user } = this.state;
        const gotoSigniup = () => browserHistory.push('/user');

        return (
            <div>
                <form onSubmit={ this.onFormSubmit }>
                    <label htmlFor="name">User Name:</label>
                    <input type="text" id="name" placeholder="User name" value={ user.name } onChange={ this.inputChange('name') } />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" placeholder="Password" value={ user.password } onChange={ this.inputChange('password') } />
                    <button type="submit">Log In</button>
                </form>

                <p className={ styles.lead }>Create an account to get started!</p>
                <button className={ styles.gotoSigniupButton } onClick={ gotoSigniup }>Sign up</button>
            </div>
        );
    }
}

UserLogin.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default UserLogin;
