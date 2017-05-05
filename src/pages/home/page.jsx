import React from "react";
import io from 'socket.io-client';

import styles from "./style.css";
import LogInForm from "../../common/components/form/login";
import Users from "../../common/components/users";

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            users: []
        };
        this.socket = io.connect();
    }

    render() {
        return (
            <div className={styles.content}>
                <h1>{!this.state.loggedIn ? 'Log In' : 'Hello User'}</h1> 
                <Users users={this.state.users} />
                <LogInForm onChangeName={this.handleChangeName.bind(this)} />
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
        var {users, name} = data;
        this.setState({users, user: name});
    }

    userJoined(data) {
        var {users} = this.state;
        var {name} = data;
        users.push(name);
        this.setState({users});
    }

    userLeft(data) {
        var {users, messages} = this.state;
        var {name} = data;
        var index = users.indexOf(name);
        users.splice(index, 1);
        this.setState({users});
    }

    userChangedName(data) {
        var {oldName, newName} = data;
        var {users} = this.state;
        var index = users.indexOf(oldName);
        users.splice(index, 1, newName);
        this.setState({users});
    }

    handleChangeName(newName) {
        var oldName = this.state.user;
        this.socket.emit('change:name', { name : newName}, (result) => {
            if(!result) {
                return alert('There was an error changing your name');
            }
            var {users} = this.state;
            var index = users.indexOf(oldName);
            users.splice(index, 1, newName);
            this.setState({users, user: newName});
        });
    }
}
