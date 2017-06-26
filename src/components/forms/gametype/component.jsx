import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class GameTypeForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            type: 0,
            uid: '',
            error: '',
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { gametype } = nextProps;

        if (!_.isEmpty(gametype)) {
            const { name, description, type, uid } = gametype;

            this.setState({ name, description, type, uid });
        }
    }

    onFormSubmit(event) {
        const { name, type, description, uid } = this.state;
        const { onGameTypeChange } = this.props;
        event.preventDefault();

        onGameTypeChange({ name, type, description, uid });
        this.setState({
            name: '',
            description: '',
            type: 0,
            uid: '',
            error: '',
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name]: value, error: '' });
    }

    render() {
        const { name, type, description, error } = this.state;

        return (
            <form onSubmit={ this.onFormSubmit }>
                {error && <p>{error}</p>}

                <label htmlFor="name">Game type name:</label>
                <input type="text" value={ name } placeholder="The game or sport being played" name="name" onChange={ this.handleChange } />

                <label htmlFor="description">Game type description:</label>
                <textarea value={ description } name="description" onChange={ this.handleChange } />

                <label htmlFor="type">Type of game:</label>
                <select value={ type } name="type" onChange={ this.handleChange }>
                    <option value={ 0 }>High Score Wins</option>
                    <option value={ 1 }>Lowest Score Wins</option>
                </select>

                <button type="submit">Submit</button>
            </form>
        );
    }
}

GameTypeForm.propTypes = {
    onGameTypeChange: PropTypes.func.isRequired,
    gametype: PropTypes.object,
};

GameTypeForm.defaultProps = {
    gametype: {},
};

export default GameTypeForm;
