import React from 'react';
import PropTypes from 'prop-types';

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
    }

    componentWillMount() {
        const { socket } = this.props;
        const { uid } = this.props.match.params;

        socket.emit('game:getById', { uid }, (result) => {
            const { game } = result;
            this.setState({ game });
        });

        socket.on('game:update', (game) => {
            if (game.uid === uid) {
                this.setState({ game });
            }
        });
    }

    componentDidMount() {
        const { socket } = this.props;

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
        const { socket, history } = this.props;

        socket.emit('game:update', game, () => {
            history.push('/');
        });
    }

/******************
 *
 * Render
 *
 *****************/

    render() {
        const { game, gametypes, users } = this.state;

        return (
            <div className="hg__main">
                <GameForm onGameCreated={ this.handleGameCreated } game={ game } gametypes={ gametypes } users={ users } />
            </div>
        );
    }
}

GamePage.propTypes = {
    socket: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default GamePage;
