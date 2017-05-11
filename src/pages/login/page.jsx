import React from 'react';
import { Link, browserHistory } from 'react-router';
import styles from './style.css';

import UserSignup from '../../components/forms/signup/component';

class LoginPage extends React.Component {
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
        const { socket } = this.props.route;
        const { password } = newUser;

        socket.emit('user:hashPassword', { password }, (result) => {
            const { hash } = result;
            newUser.password = hash;
            socket.emit('user:update', { newUser });
                
            browserHistory.push('/');
        });
    }
}

export default LoginPage;