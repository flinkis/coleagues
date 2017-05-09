import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import {Link} from 'react-router';
import _ from 'lodash';

import styles from './style.css';
import UserLogin from '../../components/forms/login/component';
import UserList from '../../components/userlist/component';
import MatchList from '../../components/matchlist/component';
import CreateMatchForm from '../../components/forms/match/component';

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            loggedIn: false,
            matches: []
        };

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    render() {
        const { users, name, loggedIn, matches } = this.state;

        return (
            <div className={ styles.content }>
                <h1>{ !loggedIn ? 'Log In' : 'Hello ' + name }</h1> 
                <UserList users={ users } name={ name } />
                { !loggedIn ? 
                    <UserLogin onChangeName={ this.handleChangeName } /> :
                    <button onClick={ this.handleLogout }>Log out</button>
                }

                <Link to="/match">Create Match</Link>
                <MatchList matches={matches}/>
            </div>
        );
    }

    componentDidMount() {
        const { socket } = this.props.route;

        socket.on('init', this.initialize.bind(this));
        socket.on('user:join', this.userJoined.bind(this));
        socket.on('user:left', this.userLeft.bind(this));
        socket.on('change:name', this.userChangedName.bind(this));
        socket.on('matches:add', this.addMatch.bind(this));
        socket.on('matches:remove', this.removeMatch.bind(this));
    }

    initialize(data) {
        const { users, name, matches } = data;
        this.setState({
            users, name, matches
        });
    }

    userJoined(data) {
        const { users } = this.state;
        const { name } = data;

        users.push(name);
        this.setState({users});
    }

    userLeft(data) {
        const { users } = this.state;
        const { name } = data;

        _.pull(users, name);
        this.setState({ users });
    }

    userChangedName(data) {
        console.log('userChangedName => ', data);
        const { oldName, newName } = data;
        const { users } = this.state;
        const index = users.indexOf(oldName);

        users.splice(index, 1, newName);
        this.setState({users});
    }

    addMatch(data) {
        const { matches } = this.state;
        const { match } = data;

        matches.push(match);
        this.setState({matches});
    }

    removeMatch(data) {
        const { matches } = this.state;
        const { match } = data;

        _.pull(matches, match);
        this.setState({ matches });
    }

    handleChangeName(newName) {
        const { users, name } = this.state;
        const { socket } = this.props.route;

        socket.emit('change:name', { newName, oldName: name}, (result) => {
            if(!result) {
                return alert('There was an error changing your name');
            }
            const index = users.indexOf(name);

            users.splice(index, 1, newName);
            this.setState({
                users,
                name: newName,
                loggedIn: true
            });
        });
    }

    handleLogout() {
        const { users, name } = this.state;
        const { socket } = this.props.route;
        const newName = this.getNewName();

        socket.emit('change:name', { newName, oldName: name }, (result) => {
            if(!result) {
                return alert('There was an error changing your name');
            }
            const index = users.indexOf(name);

            users.splice(index, 1, newName);
            this.setState({
                users,
                name: newName,
                loggedIn: false
            });
        });
    }

    getNewName() {
        const { users } = this.state;
        let newName,
        nextUserId = 1;

        do {
            newName = 'Guest ' + nextUserId++;
        } while (_.includes(users, newName));

        return newName;
    }

    onMatchRemove(match) {
        const { matches } = this.state;
        const { socket } = this.props.route;

        _.pull(matches, match);
        this.setState({ matches });
        socket.emit('matches:remove', { match });
    }
}

HomePage.PropTypes = {
    socket: PropTypes.func
}

export default HomePage;
