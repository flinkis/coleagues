import React from 'react';
import PropTypes from 'prop-types';

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
        const { socket } = this.props;
        const { params } = this.props.match;

        socket.emit('game:getById', { uid: params.uid }, (result) => {
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
        const { params } = this.props.match;

        if (params.uid === response.uid) {
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
        const { socket, history } = this.props;
        const { game } = this.state;

        socket.emit('game:update', { ...game, participants }, (result) => {
            if (!result) {
                return alert('There was an error reporting score');
            }
            history.goBack();
        });
    }

    render() {
        const { game } = this.state;
        return (
            <div className="hg__main">
                <ScoreForm onScoreChange={ this.hanleScoreChange } game={ game } />
            </div>
        );
    }
}

ScorePage.propTypes = {
    socket: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default ScorePage;
