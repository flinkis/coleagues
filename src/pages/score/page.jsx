import React from 'react';
import PropTypes from 'prop-types';
import { Link, browserHistory } from 'react-router';

import ScoreForm from '../../components/forms/score/component';

class ScorePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game: {},
            gametypes: [],
            scoring: [],
        };

        this.hanleScoreChange = this.hanleScoreChange.bind(this);
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

        socket.emit('gametype:request', (response) => {
            const { gametypes } = response;

            this.setState({ gametypes });
        });

        socket.emit('gametype:scoring', (response) => {
            const { scoring } = response;

            this.setState({ scoring });
        });
    }

    updateGames(response) {
        const { game } = this.state;
        const { uid } = this.props.params;

        if (uid === response.uid) {
            game.score = response.game.score;
            this.setState({ game });
        }
    }


/******************
 *
 * Handlers
 *
 *****************/

    hanleScoreChange(participants) {
        const { socket } = this.props.route;
        const { game } = this.state;

        socket.emit('game:update', { ...game, participants }, (result) => {
            if (!result) {
                return alert('There was an error reporting score');
            }
            browserHistory.push('/');
        });
    }

    render() {
        const { game } = this.state;
        return (
            <div>
                <h1>Report score</h1>
                <p>Report your score and get your standing.</p>
                <Link to="/">Home</Link>
                <ScoreForm onScoreChange={ this.hanleScoreChange } game={ game } />
            </div>
        );
    }
}

ScorePage.propTypes = {
    route: PropTypes.object.isRequired,
    params: PropTypes.object,
};

ScorePage.defaultProps = {
    params: {},
};

export default ScorePage;
