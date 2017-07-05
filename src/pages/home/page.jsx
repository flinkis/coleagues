import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import _ from 'lodash';

import styles from './styles.css';

import UserLogin from '../../components/forms/login/component';
import UserList from '../../components/list/users/component';
import GamesList from '../../components/list/games/component';
import TournamentsList from '../../components/list/tournaments/component';

import Auth from '../../auth';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loggedIn: false,
            games: [],
            tournaments: [],
        };

        this.handleUserLogin = this.handleUserLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleGameRemoved = this.handleGameRemoved.bind(this);

        this.initialize = this.initialize.bind(this);
        this.userLeft = this.userLeft.bind(this);
        this.userChanged = this.userChanged.bind(this);
        this.removeGame = this.removeGame.bind(this);
        this.updateGames = this.updateGames.bind(this);
        this.updateTournaments = this.updateTournaments.bind(this);
        this.removeTournament = this.removeTournament.bind(this);
    }

/******************
 *
 * Setup Socket connection
 *
 *****************/

    componentDidMount() {
        const { socket } = this.props.route;
        const { user } = this.state;

        socket.on('init', this.initialize);

        socket.on('user:left', this.userLeft);
        socket.on('user:update', this.userChanged);
        socket.on('game:remove', this.removeGame);
        socket.on('game:update', this.updateGames);
        socket.on('tournament:update', this.updateTournaments);
        socket.on('tournament:remove', this.removeTournament);

        Auth.handleAuthentication(socket, (authenticatedUser) => {
            if (authenticatedUser && authenticatedUser !== user) {
                socket.emit('user:update', { newUser: authenticatedUser });
                socket.emit('refresh');
                this.setState({ loggedIn: true });
            }
        });
    }

    componentWillUnmount() {
        const { socket } = this.props.route;

        socket.off('init', this.initialize);
    }

    initialize(response) {
        const { user, users, games, tournaments } = response;

        this.setState({
            user,
            users,
            games,
            tournaments,
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
        let newUserList = users;

        if (user) {
            newUserList = _.remove(users, u => u.uid !== user.uid);
        }
        newUserList.push(newUser);

        this.setState({
            users: newUserList,
        });
    }

    removeGame(response) {
        const { games } = this.state;
        const { uid } = response;
        const newGames = _.reject(games, { uid });

        this.setState({ games: newGames });
    }

    updateGames(game) {
        const { games } = this.state;
        const oldGame = _.find(games, { uid: game.uid });

        if (oldGame) {
            games.splice(games.indexOf(oldGame), 1, game);
        } else {
            games.push(game);
        }

        this.setState({ games });
    }

    updateTournaments(tournament) {
        const { tournaments } = this.state;
        const oldTournament = _.find(tournaments, { uid: tournament.uid });

        if (oldTournament) {
            tournaments.splice(tournaments.indexOf(oldTournament), 1, tournament);
        } else {
            tournaments.push(tournament);
        }

        this.setState({ tournaments });
    }

    removeTournament(response) {
        const { tournaments } = this.state;
        const { uid } = response;
        const newTournaments = _.reject(tournaments, { uid });

        this.setState({ tournaments: newTournaments });
    }

/******************
 *
 * Handlers
 *
 *****************/

    handleUserLogin(data) {
        const { users, user } = this.state;
        const { socket } = this.props.route;

        Auth.login(data, user, socket, (loggedInUser) => {
            const index = users.indexOf(user);

            users.splice(index, 1, loggedInUser);

            this.setState({
                user: loggedInUser,
                users,
                loggedIn: true,
            });
        });
    }

    handleLogout() {
        const { users, user } = this.state;
        const { socket } = this.props.route;

        Auth.logout(socket, user, () => {
            socket.emit('user:getNewGuest', (result) => {
                const { newUser } = result;
                const index = users.indexOf(user);

                users.splice(index, 1, newUser);
                this.setState({
                    user: newUser,
                    users,
                    loggedIn: false,
                });
            });
        });
    }

    handleGameRemoved(uid) {
        return () => {
            const { games } = this.state;
            const { socket } = this.props.route;
            const newGames = _.reject(games, { uid });

            this.setState({ games: newGames });
            socket.emit('game:remove', { uid });
        };
    }

/******************
 *
 * Render
 *
 *****************/

    render() {
        const { users, loggedIn, games, user, tournaments } = this.state;
        const username = user ? user.name : '';

        return (
            <div className={ styles.content }>
                <h1>{ !loggedIn ? 'Log In' : `Hello ${username}` }</h1>
                <UserList users={ users } user={ user } />

                { !loggedIn ?
                    <UserLogin onLogin={ this.handleUserLogin } /> :
                    <button onClick={ this.handleLogout }>Log out</button>
                }

                <br /><Link to="/game">Create a New Duel</Link>
                <br /><Link to="/gametype">Create/Edit Game-types</Link>
                <br /><Link to="/tournament">Create/Edit Tournaments</Link>

                <TournamentsList tournaments={ tournaments } />
                <GamesList games={ games } onGameRemoved={ this.handleGameRemoved } edit />
            </div>
        );
    }
}

HomePage.propTypes = {
    route: PropTypes.object.isRequired,
};

export default HomePage;
