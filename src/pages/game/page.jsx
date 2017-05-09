import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import _ from 'lodash';

import CreateMatchForm from '../../components/forms/match/component';

class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matches: []
        }
        this.onMatchCreate = this.onMatchCreate.bind(this);
    }
    goHome() {
        browserHistory.push('/');
    }

    onMatchCreate(match) {
        const { matches } = this.state;
        const { socket } = this.props.route;

        socket.emit('matches:add', { match }, (result) => {
            if(!result) {
                return alert('There was an error creating the match');
            }
            matches.push(match);
            this.setState({ matches });
        });
    }

    render() {
        return (
            <div>
                <h1>Create Game</h1>
                <p>Create a game and get started!</p>
                <button onClick={this.goHome}>Go Home</button>

                <CreateMatchForm onMatchCreate={ this.onMatchCreate } />
            </div>
        );
    }
}

GamePage.PropTypes = {
    socket: PropTypes.func
}

export default GamePage;