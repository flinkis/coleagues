import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';

import GameForm from '../../components/forms/game/component';

class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {},
            gametypes: [],
            users: [],
        };

        this.handleGameCreated = this.handleGameCreated.bind(this);
        this.updateGames = this.updateGames.bind(this);
    }

    componentWillMount() {
        const { socket } = this.props.route;
        const { uid } = this.props.params;

        socket.emit('game:getById', { uid }, (result) => {
            const { game } = result;
            this.setState({ game });
        });

        socket.on('game:update', this.updateGames);
    }

    componentDidMount() {
        const { socket } = this.props.route;

        socket.emit('gametype:request', (response) => {
            const { gametypes } = response;

            this.setState({ gametypes });
        });

        socket.emit('user:request', (response) => {
            const { users } = response;

            this.setState({ users });
        });
    }

/******************
 *
 * Handlers
 *
 *****************/

    handleGameCreated(game) {
        const { socket } = this.props.route;

        socket.emit('game:update', game, (result) => {
            if (!result) {
                return alert('There was an error creating the game');
            }

            browserHistory.push('/');
        });
    }

    updateGames(game) {
        this.setState({ game });
    }

/******************
 *
 * Render
 *
 *****************/

    render() {
        const { game, gametypes, users } = this.state;

        return (
            <div>
                <h1>Create Game</h1>
                <p>Create a game and get started!</p>
                <Link to="/">Go Home</Link>
                <GameForm onGameCreated={ this.handleGameCreated } game={ game } gametypes={ gametypes } users={ users } />
            </div>
        );
    }
}

GamePage.propTypes = {
    route: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
};

export default GamePage;
