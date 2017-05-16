import React from 'react';
import PropTypes from 'prop-types';

class ScoreForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newScore: [],
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { score } = nextProps;
        this.state = {
            newScore: score,
        };
    }

    onFormSubmit(event) {
        const { newScore } = this.state;
        const { onScoreChange, players, type, uid } = this.props;
        event.preventDefault();

        onScoreChange({ players, type, uid, score: newScore });
    }

    onScoreChange(index) {
        return (event) => {
            const { newScore } = this.state;

            newScore.splice(index, 1, event.target.value);
            this.setState({
                newScore,
            });
        };
    }

    render() {
        const { players } = this.props;
        const { newScore } = this.state;
        const inputs = players.map((name, index) => (
            <div key={ name }>
                <label htmlFor={ `score-${index}` }>Score for { name }:</label>
                <input type="number" id={ `score-${index}` } value={ newScore[index] } onChange={ this.onScoreChange(index) } />
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
    type: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    onScoreChange: PropTypes.func.isRequired,
};

export default ScoreForm;
