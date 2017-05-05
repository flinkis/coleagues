import React from "react";
import styles from "./style.css";
import User from "../../common/components/User";
import io from 'socket.io-client';

var socket = io.connect();

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            loggedIn: false
        };
    }

    componentWillMount() {
       
    }

    setUserStatus(isLoggedIn) {
        this.setState({
            loggedIn: isLoggedIn
        });
    }

    render() {
        return (
            <div className={styles.content}>
                <h1>{!this.state.loggedIn ? 'Log In' : 'Hello User'}</h1> 
                <p className={styles.welcomeText}>Thanks for being you!</p>
                {!this.state.loggedIn && <User updateUserStatus={this.setUserStatus.bind(this)} />}
            </div>
        );
    }
}
