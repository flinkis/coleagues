import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class GameTypeForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gametype: {
                uid: '',
                name: '',
                description: '',
                type: '0',
                cooperative: false,
                teams: false,
            },
            error: '',
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { gametype } = nextProps;

        if (!_.isEmpty(gametype)) {
            this.setState({ gametype });
        }
    }

    onFormSubmit(event) {
        const { gametype } = this.state;
        const { onGameTypeChange } = this.props;
        event.preventDefault();

        onGameTypeChange(gametype);

        this.setState({
            gametype: {
                uid: '',
                name: '',
                description: '',
                type: '0',
                cooperative: false,
                teams: false,
            },
            error: '',
        });
    }

    handleChange(event) {
        const { gametype } = this.state;
        const { type, checked, value, name } = event.target;
        gametype[name] = type === 'checkbox' ? checked : value;

        this.setState({
            gametype,
            error: '',
        });
    }

    render() {
        const { gametype, error } = this.state;
        const { scoring } = this.props;
        const scoreOptions = scoring.map(score => <option value={ score.uid }>{ score.name }</option>);

        return (
            <form onSubmit={ this.onFormSubmit }>
                {error && <p>{error}</p>}

                <label htmlFor="name">Game type name:</label>
                <input type="text" value={ gametype.name } placeholder="The game or sport being played" name="name" onChange={ this.handleChange } />

                <label htmlFor="description">Game type description:</label>
                <textarea value={ gametype.description } name="description" onChange={ this.handleChange } />

                <label htmlFor="type">Type of game:</label>
                <select value={ gametype.type } name="type" onChange={ this.handleChange }>
                    { scoreOptions }
                </select>

                <label htmlFor="cooperative">Cooperative:</label>
                <input type="checkbox" checked={ gametype.cooperative } name="cooperative" onChange={ this.handleChange } />

                <label htmlFor="team">Play in teams:</label>
                <input type="checkbox" checked={ gametype.teams } name="teams" onChange={ this.handleChange } />

                <button type="submit">Submit</button>
            </form>
        );
    }
}

GameTypeForm.propTypes = {
    onGameTypeChange: PropTypes.func.isRequired,
    gametype: PropTypes.object,
    scoring: PropTypes.array,
};

GameTypeForm.defaultProps = {
    gametype: {},
    scoring: [],
};

export default GameTypeForm;
