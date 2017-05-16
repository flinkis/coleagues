import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';

import CreateMatchForm from '../../components/forms/game/component';

class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {},
            gametypes: [],
        };

        this.handleGameCreated = this.handleGameCreated.bind(this);
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
    }

/******************
 *
 * Handelers
 *
 *****************/

    handleGameCreated(game) {
        const { socket } = this.props.route;

        socket.emit('game:update', { game }, (result) => {
            if (!result) {
                return alert('There was an error creating the game');
            }

            browserHistory.push('/');
        });
    }

/******************
 *
 * Render
 *
 *****************/

    render() {
        const { game, gametypes } = this.state;

        return (
            <div>
                <h1>Create Game</h1>
                <p>Create a game and get started!</p>
                <Link to="/">Go Home</Link>
                <CreateMatchForm onGameCreated={ this.handleGameCreated } game={ game } gametypes={ gametypes } />
            </div>
        );
    }
}

GamePage.propTypes = {
    route: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
};

export default GamePage;
