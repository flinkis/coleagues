import React from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

import styles from './style.css';
import UserLogin from '../../components/forms/login/component';
import UserList from '../../components/userlist/component';
import GamesList from '../../components/gameslist/component';
import Auth from '../../auth';

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
        this.userLeft = this.userLeft.bind(this);
        this.userChanged = this.userChanged.bind(this);
        this.addGame = this.addGame.bind(this);
        this.removeGame = this.removeGame.bind(this);
        this.updateGames = this.updateGames.bind(this);
    }

    componentWillMount() {
        const { getUser, setUser, socket } = this.props.route;
        const { users, user } = this.state;

        Auth.handleAuthentication(socket, (authenticatedUser) => {
            if (authenticatedUser) {
                socket.emit('user:update', { newUser: authenticatedUser });
                socket.emit('refresh');
                this.setState({loggedIn: true});
            }
        });
    }

    render() {
        const { users, loggedIn, games, user } = this.state;
        const username = user ? user.name : '';

        return (
            <div className={ styles.content }>
                <h1>{ !loggedIn ? 'Log In' : 'Hello ' + username }</h1> 
                <UserList users={ users } user={ user } />

                { !loggedIn ? 
                    <UserLogin onLogin={ this.handleUserLogin } /> :
                    <button onClick={ this.handleLogout }>Log out</button>
                }

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
        const { setUser, socket } = this.props.route;

        Auth.login(data, user, socket, (loggedInUser) => {
            const index = users.indexOf( user );

            users.splice(index, 1, loggedInUser);

            this.setState({
                user: loggedInUser,
                users,
                loggedIn: true
            });
            setUser(loggedInUser);
        });
    }

    handleLogout() {
        const { users, user } = this.state;
        const { setUser, socket } = this.props.route;

        Auth.logout(socket, user, () => {
            socket.emit('user:getNewGuest', (result) => {
                const { newUser } = result;
                const index = users.indexOf(user);

                users.splice(index, 1, newUser);
                this.setState({
                    user: newUser,
                    users,
                    loggedIn: false
                });
                setUser(newUser);
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

    componentWillUnmount() {
        const { socket } = this.props.route;

        socket.off('init', this.initialize);
    }

    initialize(response) {
        const { user, users, games } = response;

        this.setState({
            user, users, games
        });

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
        let newUserList = users;

        if (user) {
            const newUserList = _.remove(users, (u) => u.uid === user.uid);
        }
        newUserList.push(newUser);

        this.setState({
            users: newUserList
        });
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
    socket: PropTypes.object,
    user: PropTypes.object,
    setUser: PropTypes.func
}

export default HomePage;
