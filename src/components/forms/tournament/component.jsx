import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class CreateTournamnentForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tournament: {
                name: '',
                description: '',
                start_date: '',
                end_date: '',
                players: [],
                game_type: '',
                uid: '',
            },
            error: '',
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { tournament } = nextProps;

        if (!_.isEmpty(tournament)) {
            this.setState({ tournament });
        }
    }

/******************
 *
 * Handelers
 *
 *****************/

    onFormSubmit(event) {
        const { tournament } = this.state;
        const { onTournamentCreate } = this.props;
        event.preventDefault();

        onTournamentCreate(tournament);
    }

    onPlayerChange(index) {
        return (event) => {
            const { tournament } = this.state;

            tournament.players.splice(index, 1, event.target.value);

            this.setState({
                tournament,
                error: '',
            });
        };
    }

    handleChangeValueValue(event) {
        const { tournament } = this.state;
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        tournament[name] = value;

        this.setState({
            tournament,
            error: '',
        });
    }

    addPlayer() {
        const { tournament } = this.state;

        tournament.players.concat(['']);
        this.setState({
            tournament,
            error: '',
        });
    }

    removePlayer(index) {
        return () => {
            const { tournament } = this.state;

            _.pullAt(tournament.players, index);

            this.setState({
                tournament,
                error: '',
            });
        };
    }

/******************
 *
 * Render
 *
 *****************/

    render() {
        const { tournament, error } = this.state;

        return (
            <form onSubmit={ this.onFormSubmit }>
                { error && <p>{error}</p> }
                { inputs }
                <select value={ gametype } name="gametype" onChange={ this.handleChangeValue }>
                    { options }
                </select>
                <button type="button" onClick={ this.addPlayer }>add player</button>
                <button type="submit">{ _.isUndefined(tournament.uid) ? 'Start tournament' : 'Update tournament' }</button>
            </form>
        );
    }
}

CreateTournamnentForm.propTypes = {
    onTournamentCreate: PropTypes.func.isRequired,
    tournament: PropTypes.object,
};

CreateTournamnentForm.defaultProps = {
    tournament: {},
};

export default CreateTournamnentForm;
