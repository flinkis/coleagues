import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Validate from '../../../helpers/validate';
import general_style from '../../../common/general.css';

class CreateTournamnentForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tournament: {
                uid: null,
                name: '',
                description: '',
                start_date: '',
                end_date: '',
                participants: [],
                game_type: '',
            },
            participant: {},
            error: [],
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleParticipantsChange = this.handleParticipantsChange.bind(this);
        this.addParticipants = this.addParticipants.bind(this);
        this.removeParticipants = this.removeParticipants.bind(this);
        this.getDefaultParticipant = this.getDefaultParticipant.bind(this);
        this.clearForm = this.clearForm.bind(this);
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

        const validate = new Validate();
        validate
            .isset(tournament.name, 'Name is requierd!')
            .length(tournament.participants, 'You have to have at least one participant!')
            .validate((error) => {
                if (error) {
                    this.setState({ error });
                } else {
                    onTournamentChange(tournament);
                    this.clearForm();
                }
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

    clearForm() {
        this.setState({
            tournament: {
                uid: null,
                name: '',
                description: '',
                start_date: '',
                end_date: '',
                participants: [],
                game_type: '',
            },
            error: [],
        });
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
        const { gameTypes, tournamentTypes, users } = this.props;

        const makeOptions = type => <option key={ type.uid } value={ type.uid }>{ type.name }</option>;
        const game_types_options = gameTypes.map(makeOptions);
        const tournament_types_options = tournamentTypes.map(makeOptions);
        const users_options = _.chain(users)
            .sortBy('name')
            .reject(user => !!_.find(tournament.participants, user))
            .map(makeOptions)
            .value();

        const participants = tournament.participants.map((user, index) => (
            <li key={ user.uid } >
                { user.name } <button type="button" onClick={ this.removeParticipants(index) }>-</button>
            </li>
        ));
        const errorMsgs = error ? error.map((errorMsg, index) => {
            const key = `error${index}`;
            return <p key={ key } className={ general_style.errorMsg }>{ errorMsg }</p>;
        }) : null;

        return (
            <form onSubmit={ this.onFormSubmit }>
                { errorMsgs }

                <label htmlFor="name">Tournament name:</label>
                <input id="name" type="text" name="name" value={ tournament.name } onChange={ this.handleValueChange } />

                <label htmlFor="description">Game type description:</label>
                <textarea id="description" name="description" value={ tournament.description } onChange={ this.handleValueChange } />

                <label htmlFor="start_date">Start date:</label>
                <input id="start_date" type="date" name="start_date" value={ tournament.start_date } onChange={ this.handleValueChange } />

                <label htmlFor="end_date">End date:</label>
                <input id="end_date" type="date" name="end_date" value={ tournament.end_date } onChange={ this.handleValueChange } />

                <label htmlFor="game_type">Game type:</label>
                <select id="game_type" value={ tournament.game_type } name="game_type" onChange={ this.handleValueChange }>
                    { game_types_options }
                </select>

                <label htmlFor="tournament_type">Tournament type:</label>
                <select value={ tournament.tournament_type } name="tournament_type" onChange={ this.handleValueChange }>
                    { tournament_types_options }
                </select>

                <h3>Participants</h3>
                <ul>
                    { _.isEmpty(tournament.participants) ? 'Select some users to participate in your tournament.' : participants }
                </ul>

                <select value={ participant.uid } name="participants" onChange={ this.handleParticipantsChange }>
                    { users_options }
                </select>
                <button type="button" onClick={ this.addParticipants }>Add participants</button><br />
                <button type="submit">{ _.isNull(tournament.uid) ? 'Start tournament' : 'Update tournament' }</button>
                <button type="button" onClick={ this.clearForm }>clear</button>
            </form>
        );
    }
}

CreateTournamnentForm.propTypes = {
    onTournamentChange: PropTypes.func.isRequired,
    selectedTournament: PropTypes.object,
    gameTypes: PropTypes.array,
    tournamentTypes: PropTypes.array,
    users: PropTypes.array,
};

CreateTournamnentForm.defaultProps = {
    selectedTournament: {},
    gameTypes: [],
    tournamentTypes: [],
    users: [],
};

export default CreateTournamnentForm;
