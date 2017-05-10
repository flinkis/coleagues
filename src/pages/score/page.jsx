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

        this.onScoreChange = this.onScoreChange.bind(this);
    }

    componentWillMount() {
        const { socket } = this.props.route;
        const { uid } = this.props.params;

        socket.emit('games:getById', { uid }, (result) => {
            const { game } = result;
            this.setState({ game });
        });
    }

    goHome() {
        browserHistory.push('/');
    }

    onScoreChange(game) {
        const { socket } = this.props.route;
        const { uid } = this.props.params;

        socket.emit('games:update', { game, uid }, (result) => {
            if(!result) {
                return alert('There was an error reporting score');
            }
            this.goHome();
        });
    }

    render() {
        const { game } = this.state;
        return (
            <div>
                <h1>Report score</h1>
                <p>Report your score and get your standing.</p>
                <Link to="/">Go back</Link>

                <ScoreForm { ...game } onScoreChange={ this.onScoreChange } />
            </div>
        );
    }
}

ScorePage.PropTypes = {
    socket: PropTypes.object
}

export default ScorePage;