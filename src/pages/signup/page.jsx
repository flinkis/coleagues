import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import styles from './style.css';

import UserSignup from '../../components/forms/signup/component';
import Auth from '../../auth';

class SignupPage extends Component {
    constructor(props) {
        super(props);

        this.handleSignup = this.handleSignup.bind(this);
    }

/******************
 *
 * Handelers
 *
 *****************/

    handleSignup(newUser) {
        const { socket } = this.props.route;

        Auth.signup(newUser, socket, (response) => {
            if (response) {
                browserHistory.push('/');
            } else {
                alert('Username in use, please change your name to somthing else!');
            }
        });
    }

/******************
 *
 * Render
 *
 *****************/

    render() {
        return (
            <div className={ styles.content }>
                <h1 className={ styles.heading }>Create account</h1>
                <p className={ styles.lead }>Join the fun!</p>
                <UserSignup onSignup={ this.handleSignup } />
                <Link to="/" >Nevermind</Link>
            </div>
        );
    }
}

SignupPage.propTypes = {
    route: PropTypes.object.isRequired,
};

export default SignupPage;
