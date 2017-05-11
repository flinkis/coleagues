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
        
        this.handleGameCreated = this.handleGameCreated.bind(this);
    }

    render() {
        return (
            <div>
                <h1>Create Game</h1>
                <p>Create a game and get started!</p>
                <Link to="/">Go Home</Link>
                <CreateMatchForm onGameCreated={ this.handleGameCreated } />
            </div>
        );
    }

/******************
 *
 * Handelers
 *
 *****************/

    handleGameCreated(game) {
        const { games } = this.state;
        const { socket } = this.props.route;

        socket.emit('games:getUniqueId', (result) => {
            const { uid } = result;
            game.uid = uid;

            socket.emit('games:add', { game }, (result) => {
                if(!result) {
                    return alert('There was an error creating the game');
                }

                browserHistory.push('/');
            });
        });
    }
}

GamePage.PropTypes = {
    socket: PropTypes.func
}

export default GamePage;