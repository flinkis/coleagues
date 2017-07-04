import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class ScoreForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            participants: [],
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { game } = nextProps;

        if (!_.isEmpty(game)) {
            this.setState({ participants: game.participants });
        }
    }

    onFormSubmit(event) {
        const { participants } = this.state;
        const { onScoreChange } = this.props;
        event.preventDefault();

        onScoreChange(participants);
    }

    handleChange(index) {
        return (event) => {
            const { participants } = this.state;
            const { type, checked, value, name } = event.target;

            participants[index] = { ...participants[index], [name]: (type === 'checkbox' ? checked : value) };
            this.setState({ participants });
        };
    }

    render() {
        const { participants } = this.state;

        const inputs = participants.map((player, index) => (
            <div key={ player.uid }>
                <label htmlFor={ `score-${index}` }>Score for { player.name }:</label>
                <input type="number" id={ `score-${index}` } value={ player.score } name="score" onChange={ this.handleChange(index) } />
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
