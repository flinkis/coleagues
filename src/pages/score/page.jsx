import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';
import _ from 'lodash';

import ScoreForm from '../../components/forms/score/component';

class ScorePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {
                players: [],
                score: []
            }
        }

        this.hanleScoreChange = this.hanleScoreChange.bind(this);
        this.updateGames = this.updateGames.bind(this);
    }

    componentWillMount() {
        const { socket } = this.props.route;
        const { uid } = this.props.params;

        socket.emit('games:getById', { uid }, (result) => {
            const { game } = result;
            this.setState({ game });
        });

        socket.on('games:update', this.updateGames);
    }

    updateGames(response) {
        const { game } = this.state;
        const { uid } = this.props.params;

        if (uid === response.uid) {
            game.score = response.game.score;
            this.setState({ game });
        }
    }

    render() {
        const { game } = this.state;
        return (
            <div>
                <h1>Report score</h1>
                <p>Report your score and get your standing.</p>
                <Link to="/">Go back</Link>

                <ScoreForm { ...game } onScoreChange={ this.hanleScoreChange } />
            </div>
        );
    }

/******************
 *
 * Handelers
 *
 *****************/

    hanleScoreChange(game) {
        const { socket } = this.props.route;
        const { uid } = this.props.params;

        socket.emit('games:update', { game, uid }, (result) => {
            if(!result) {
                return alert('There was an error reporting score');
            }
            browserHistory.push('/');
        });
    }
}

ScorePage.PropTypes = {
    socket: PropTypes.object
}

export default ScorePage;