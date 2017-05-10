import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

import CreateMatchForm from '../../components/forms/game/component';

class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            games: []
        }
        this.onGameCreated = this.onGameCreated.bind(this);
    }
    goHome() {
        browserHistory.push('/');
    }

    onGameCreated(game) {
        const { games } = this.state;
        const { socket } = this.props.route;

        socket.emit('games:getUniqueId', (result) => {
            const { uid } = result;
            game.uid = uid;

            socket.emit('games:add', { game }, (result) => {
                if(!result) {
                    return alert('There was an error creating the game');
                }

                this.goHome();
            });
        });
    }

    render() {
        return (
            <div>
                <h1>Create Game</h1>
                <p>Create a game and get started!</p>
                <Link to="/">Go Home</Link>
                <CreateMatchForm onGameCreated={ this.onGameCreated } />
            </div>
        );
    }
}

GamePage.PropTypes = {
    socket: PropTypes.func
}

export default GamePage;