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
                participants: [],
                game_type: '',
            },
            participant: {},
            error: '',
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleParticipantsChange = this.handleParticipantsChange.bind(this);
        this.addParticipants = this.addParticipants.bind(this);
        this.removeParticipants = this.removeParticipants.bind(this);
        this.getDefaultParticipant = this.getDefaultParticipant.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { selectedTournament, users, gameTypes } = nextProps;
        let { tournament, participant } = this.state;

        if (_.isEmpty(selectedTournament) && !_.isEmpty(users)) {
            participant = _.first(users);
        }

        if (_.isEmpty(selectedTournament) && !_.isEmpty(gameTypes)) {
            tournament.game_type = _.first(gameTypes).uid;
        }

        if (!_.isEmpty(selectedTournament)) {
            tournament = selectedTournament;
            participant = this.getDefaultParticipant(selectedTournament);
        }

        this.setState({ tournament, participant });
    }

/******************
 *
 * Handlers
 *
 *****************/

    onFormSubmit(event) {
        const { tournament } = this.state;
        const { onTournamentChange } = this.props;
        event.preventDefault();

        onTournamentChange(tournament);
        this.setState({
            tournament: {
                name: '',
                description: '',
                start_date: '',
                end_date: '',
                participants: [],
                game_type: '',
            },
        });
    }

    getDefaultParticipant(tournament) {
        const { users } = this.props;
        return _.chain(users)
            .sortBy('name')
            .reject(user => !!_.find(tournament.participants, user))
            .first()
            .defaultTo({})
            .value();
    }

    handleValueChange(event) {
        const { tournament } = this.state;
        const { type, checked, value, name } = event.target;

        tournament[name] = type === 'checkbox' ? checked : value;

        this.setState({ tournament });
    }

    handleParticipantsChange(event) {
        const { value } = event.target;
        const { users } = this.props;
        const participant = _.find(users, { uid: value });

        this.setState({ participant });
    }

    addParticipants() {
        const { tournament, participant } = this.state;

        if (!_.isEmpty(participant.uid)) {
            tournament.participants.push(participant);
            const newDefault = this.getDefaultParticipant(tournament);

            this.setState({ tournament, participant: newDefault });
        }
    }

    removeParticipants(index) {
        return () => {
            const { tournament } = this.state;

            _.pullAt(tournament.participants, index);
            const newDefault = this.getDefaultParticipant(tournament);

            this.setState({ tournament, participant: newDefault });
        };
    }

/******************
 *
 * Render
 *
 *****************/

    render() {
        const { tournament, participant, error } = this.state;
        const { gameTypes, users } = this.props;
        const types_options = gameTypes.map(type => <option key={ type.uid } value={ type.uid }>{ type.name }</option>);
        const users_options = _.chain(users)
            .sortBy('name')
            .reject(user => !!_.find(tournament.participants, user))
            .map(user => <option key={ user.uid } value={ user.uid }>{ user.name }</option>)
            .defaultTo('')
            .value();
        const participants = tournament.participants.map((user, index) => (
            <li key={ user.uid } >
                { user.name } <button type="button" onClick={ this.removeParticipants(index) }>-</button>
            </li>
        ));

        return (
            <form onSubmit={ this.onFormSubmit }>
                { error && <p>{error}</p> }

                <label htmlFor="name">Tournament name:</label>
                <input type="text" name="name" value={ tournament.name } onChange={ this.handleValueChange } />

                <label htmlFor="description">Game type description:</label>
                <textarea name="description" value={ tournament.description } onChange={ this.handleValueChange } />

                <label htmlFor="start_date">Start date:</label>
                <input type="date" name="start_date" value={ tournament.start_date } onChange={ this.handleValueChange } />

                <label htmlFor="end_date">End date:</label>
                <input type="date" name="end_date" value={ tournament.end_date } onChange={ this.handleValueChange } />

                <label htmlFor="game_type">Game type:</label>
                <select value={ tournament.game_type } name="game_type" onChange={ this.handleValueChange }>
                    { types_options }
                </select>

                <h3>Participants</h3>
                <ul>
                    { _.isEmpty(tournament.participants) ? 'Select some users to participate in your tournament.' : participants }
                </ul>

                <select value={ participant.uid } name="participants" onChange={ this.handleParticipantsChange }>
                    { users_options }
                </select>
                <button type="button" onClick={ this.addParticipants }>Add participants</button>

                <button type="submit">{ _.isUndefined(tournament.uid) ? 'Start tournament' : 'Update tournament' }</button>
            </form>
        );
    }
}

CreateTournamnentForm.propTypes = {
    onTournamentChange: PropTypes.func.isRequired,
    selectedTournament: PropTypes.object,
    gameTypes: PropTypes.array,
    users: PropTypes.array,
};

CreateTournamnentForm.defaultProps = {
    selectedTournament: {},
    gameTypes: [],
    users: [],
};

export default CreateTournamnentForm;
