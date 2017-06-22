import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class ScoreForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            score: [],
            winner: [],
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { score, winner } = nextProps;
        this.setState({ score, winner });
    }

    onFormSubmit(event) {
        const { score, winner } = this.state;
        const { onScoreChange, players, type, uid } = this.props;
        event.preventDefault();

        onScoreChange({ players, type, uid, score, winner });
    }

    onWinnerChange(index) {
        return () => {
            const { winner } = this.state;

            _.fill(winner, '');
            winner[index] = true;
            this.setState({ winner });
        };
    }

    onScoreChange(index) {
        return (event) => {
            const { score } = this.state;

            score.splice(index, 1, event.target.value);
            this.setState({ score });
        };
    }

    render() {
        const { players } = this.props;
        const { score, winner } = this.state;
        const inputs = players.map((name, index) => (
            <div key={ name }>
                <label htmlFor={ `score-${index}` }>Score for { name }:</label>
                <input type="number" id={ `score-${index}` } value={ score[index] } onChange={ this.onScoreChange(index) } />
                <label htmlFor={ `winner-${index}` }>winner</label>
                <input type="checkbox" id={ `winner-${index}` } checked={ winner[index] } onChange={ this.onWinnerChange(index) } />
            </div>
        ));

        return (
            <div>
                <form onSubmit={ this.onFormSubmit }>
                    { inputs }
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

ScoreForm.propTypes = {
    players: PropTypes.array.isRequired,
    score: PropTypes.array.isRequired,
    winner: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    onScoreChange: PropTypes.func.isRequired,
};

export default ScoreForm;
