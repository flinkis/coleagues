import React from "react";
import styles from "./style.css";
import User from "../../common/components/User";
import io from 'socket.io-client';

var socket = io.connect();

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={styles.content}>
                <h1>Home Page</h1>
                Hello User.
                <p className={styles.welcomeText}>Thanks for being you!</p>
                <User />
            </div>
        );
    }
}
