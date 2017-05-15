import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import styles from './style.css';

import UserSignup from '../../components/forms/signup/component';
import Auth from '../../auth';

class SignupPage extends Component {
    constructor(props) {
        super(props);

        this.handleSignup = this.handleSignup.bind(this);
    }

    render() {
        return (
            <div className={styles.content}>
                <h1 className={styles.heading}>Create account</h1>
                <p className={styles.lead}>Join the fun!</p>
                <UserSignup onSignup={this.handleSignup} />
                <Link to="/" >Nevermind</Link>
            </div>
        );
    }

/******************
 *
 * Handelers
 *
 *****************/
 
    handleSignup(newUser) {
        const { setUser, socket } = this.props.route;

        Auth.signup(newUser, socket, (response) => {
            setUser(response);
            browserHistory.push('/');
        });
    }
}

export default SignupPage;