import React from "react";
import io from 'socket.io-client';

import styles from "./style.css";
import LogInForm from "../../common/components/form/login";
import Users from "../../common/components/users";

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            users: [],
            loggedIn: false
        };
        this.socket = io.connect();

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    render() {
        const {users, name, loggedIn} = this.state;
        return (
            <div className={styles.content}>
                <h1>{!this.state.loggedIn ? 'Log In' : 'Hello ' + name}</h1> 
                <Users users={users} />
                {!loggedIn ? 
                    <LogInForm onChangeName={this.handleChangeName} /> :
                    <button onClick={this.handleLogout}>Log out</button>
                }
            </div>
        );
    }

    componentDidMount() {
        this.socket.on('init', this.initialize.bind(this));
        this.socket.on('user:join', this.userJoined.bind(this));
        this.socket.on('user:left', this.userLeft.bind(this));
        this.socket.on('change:name', this.userChangedName.bind(this));
    }

    initialize(data) {
        console.log('initialize =>', data);
        const {users, name} = data;
        this.setState({
            users, name
        });
    }

    userJoined(data) {
        console.log('userJoined =>', data);
        const {users} = this.state;
        const {name} = data;
        users.push(name);
        this.setState({
            users, 
            loggedIn: true
        });
    }

    userLeft(data) {
        console.log('userLeft =>', data);
        const {users} = this.state;
        const {name} = data;
        const index = users.indexOf(name);
        users.splice(index, 1);
        this.setState({
            users, 
            loggedIn: false
        });
    }

    userChangedName(data) {
        console.log('userChangedName =>', data);
        const {oldName, newName} = data;
        const {users} = this.state;
        const index = users.indexOf(oldName);
        users.splice(index, 1, newName);
        this.setState({
            users, 
            loggedIn: true
        });
    }

    handleChangeName(newName) {
        this.socket.emit('change:name', { name : newName}, (result) => {
            if(!result) {
                return alert('There was an error changing your name');
            }
            const {users, name} = this.state;
            const index = users.indexOf(name);
            users.splice(index, 1, newName);
            this.setState({users, name: newName});
        });
    }

    handleLogout() {
        const {name} = this.state;
        this.socket.emit('disconnect', { name });
    }
}
