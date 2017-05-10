import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class ScoreForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            newScore: []
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { score } = nextProps;
        this.state = { 
            newScore: score
        };
    }

    onFormSubmit(event) {
        const { newScore } = this.state;
        const { onScoreChange, players } = this.props;
        event.preventDefault();

        onScoreChange({ players, score: newScore });
    }

    onScoreChange(index) {
        return (event) => {
            const { newScore } = this.state;

            newScore.splice(index, 1, event.target.value);
            this.setState({
                newScore
            });
        }
    }

    render() {
        const { players, score } = this.props;
        const { newScore } = this.state;
        const inputs = players.map((name, index) => (
            <div key={ index }>
                <label htmlFor={`score-${index}`}>Score for {name}:</label>
                <input type="number" id={`score-${index}`} value={newScore[index]} onChange={this.onScoreChange(index)}/>
            </div>
        ));
        return (
            <div>
                <form onSubmit={this.onFormSubmit}>
                    {inputs}
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
}

ScoreForm.PropTypes = {
    players: PropTypes.array,
    score: PropTypes.array,
    onScoreChange: PropTypes.func
}

export default ScoreForm;
