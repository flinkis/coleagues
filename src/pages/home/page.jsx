import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

import styles from './style.css';
import UserLogin from '../../components/forms/login/component';
import UserList from '../../components/userlist/component';
import GamesList from '../../components/gameslist/component';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loggedIn: false,
            games: []
        };

        this.handleUserLogin = this.handleUserLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleGameRemoved = this.handleGameRemoved.bind(this);

        this.initialize = this.initialize.bind(this);
        this.userJoined = this.userJoined.bind(this);
        this.userLeft = this.userLeft.bind(this);
        this.userChanged = this.userChanged.bind(this);
        this.addGame = this.addGame.bind(this);
        this.removeGame = this.removeGame.bind(this);
        this.updateGames = this.updateGames.bind(this);

        this.gotoSigniup = this.gotoSigniup.bind(this);
    }

    gotoSigniup() {
        browserHistory.push('/create/user');
    }

    render() {
        const { users, user, loggedIn, games } = this.state;

        return (
            <div className={ styles.content }>
                <h1>{ !loggedIn ? 'Log In' : 'Hello ' + user.name }</h1> 
                <UserList users={ users } user={ user } />

                { !loggedIn ? 
                    <UserLogin onLogin={ this.handleUserLogin } /> :
                    <button onClick={ this.handleLogout }>Log out</button>
                }

                <p className={ styles.lead }>Create an account to get started!</p>
                <button className={ styles.gotoSigniupButton } onClick={ this.gotoSigniup }>Sign up</button>

                <Link to="/create/game">Create game</Link>
                <GamesList games={ games } onGameRemoved={ this.handleGameRemoved }/>
            </div>
        );
    }

/******************
 *
 * Handelers
 *
 *****************/

    handleUserLogin(data) {
        const { users, user } = this.state;
        const { socket } = this.props.route;

        socket.emit('user:checkPassword', data, (result) => {
            if(!result) {
                return alert('There was an error loging in');
            }

            const { loggedInUser } = result;
            const index = users.indexOf(user);

            socket.emit('user:update', { newUser: loggedInUser });

            users.splice(index, 1, loggedInUser);
            this.setState({
                users,
                user: loggedInUser,
                loggedIn: true
            });
        })
    }

    handleLogout() {
        const { users, user } = this.state;
        const { socket } = this.props.route;

        socket.emit('user:getNewGuest', (result) => {
            const { newGuest } = result;
            const index = users.indexOf(user);

            users.splice(index, 1, newGuest);
            this.setState({
                users,
                user: newGuest,
                loggedIn: false
            });
        });
    }

    handleGameRemoved(uid) {
        return (event) => {
            const { games } = this.state;
            const { socket } = this.props.route;
            const newGames = _.reject(games, { uid });

            this.setState({ games: newGames });
            socket.emit('games:remove', { uid });
        }
    }

/******************
 *
 * Setup Socket connection
 *
 *****************/

    componentDidMount() {
        const { socket } = this.props.route;

        socket.on('init', this.initialize);

        socket.on('user:join', this.userJoined);
        socket.on('user:left', this.userLeft);
        socket.on('user:update', this.userChanged);

        socket.on('games:add', this.addGame);
        socket.on('games:remove', this.removeGame);
        socket.on('games:update', this.updateGames);
    }

    initialize(response) {
        const { users, user, games } = response;

        this.setState({
            users, user, games
        });
    }

    userJoined(response) {
        const { users } = this.state;
        const { user } = response;

        users.push(user);
        this.setState({users});
    }

    userLeft(response) {
        const { users } = this.state;
        const { uid } = response;

        this.setState({ users: _.reject(users, { uid }) });
    }

    userChanged(response) {
        const { user, newUser } = response;
        const { users } = this.state;
        const index = users.indexOf(user);

        users.splice(index, 1, newUser);
        this.setState({users});
    }

    addGame(response) {
        const { games } = this.state;
        const { game } = response;

        games.push(game);
        this.setState({games});
    }

    removeGame(response) {
        const { games } = this.state;
        const { uid } = response;
        const newGames = _.reject(games, { uid });

        this.setState({ games: newGames });
    }

    updateGames(response) {
        const { games } = this.state;
        const { game, uid } = response;
        const oldGame = _.find(games, { uid });

        if ( oldGame ) {
            game.uid = uid;
            games.splice(
                games.indexOf(oldGame), 1, game
            );

            this.setState({ games });
        }
    }
}

HomePage.PropTypes = {
    socket: PropTypes.func
}

export default HomePage;
