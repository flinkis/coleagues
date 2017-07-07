import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class ScoreForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            participants: [],
            score: [],
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { game } = nextProps;

        if (!_.isEmpty(game)) {
            this.setState({
                participants: game.participants,
                score: game.participants.map(player => (player.score ? player.score : 0)),
            });
        }
    }

    onFormSubmit(event) {
        const { participants, score } = this.state;
        const { onScoreChange } = this.props;
        event.preventDefault();

        onScoreChange(_.map(participants, (player, index) => ({ ...player, score: score[index] })));
    }

    handleChange(index) {
        return (event) => {
            const { score } = this.state;
            const { type, checked, value } = event.target;

            score[index] = type === 'checkbox' ? checked : value;
            this.setState({ score });
        };
    }

    render() {
        const { participants, score } = this.state;

        const inputs = participants.map((player, index) => (
            <div key={ player.uid }>
                <label htmlFor={ `score-${index}` }>Score for { player.name }:</label>
                <input type="number" id={ `score-${index}` } value={ score[index] } name="score" onChange={ this.handleChange(index) } />
            </div>
        ));

        return (
            <div>
                <form onSubmit={ this.onFormSubmit }>
                    { inputs }
                    <button type="submit">Report Score</button>
                </form>
            </div>
        );
    }
}

ScoreForm.propTypes = {
    game: PropTypes.object.isRequired,
    onScoreChange: PropTypes.func.isRequired,
};

export default ScoreForm;
