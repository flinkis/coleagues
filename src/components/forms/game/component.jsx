import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class GameForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            new_game: {
                uid: '',
                participants: [],
                gametype: '',
            },
            participant: {},
            error: '',
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.getDefaultParticipant = this.getDefaultParticipant.bind(this);
        this.handleParticipantsChange = this.handleParticipantsChange.bind(this);
        this.addParticipants = this.addParticipants.bind(this);
        this.removeParticipants = this.removeParticipants.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { game, users, gametypes } = nextProps;
        let { new_game, participant } = this.state;

        if (_.isEmpty(game) && !_.isEmpty(users)) {
            participant = _.first(users);
        }

        if (_.isEmpty(game) && !_.isEmpty(gametypes)) {
            new_game.gametype = _.first(gametypes).uid;
        }

        if (!_.isEmpty(game)) {
            new_game = game;
            participant = this.getDefaultParticipant(game);
        }

        this.setState({ new_game, participant });
    }

/******************
 *
 * Handlers
 *
 *****************/

    onFormSubmit(event) {
        const { new_game } = this.state;
        event.preventDefault();

        if (_.every(new_game.participant, player => !_.isEmpty(player))) {
            this.props.onGameCreated({ ...new_game });
        } else {
            this.setState({ error: 'You have to add more participants.' });
        }
    }

    getDefaultParticipant(new_game) {
        const { users } = this.props;
        return _.chain(users)
            .sortBy('name')
            .reject(user => !!_.find(new_game.participants, user))
            .first()
            .defaultTo({})
            .value();
    }

    handleParticipantsChange(event) {
        const { value } = event.target;
        const { users } = this.props;
        const participant = _.find(users, { uid: value });

        this.setState({ participant });
    }

    addParticipants() {
        const { new_game, participant } = this.state;

        if (!_.isEmpty(participant)) {
            new_game.participants.push(participant);
            const newDefault = this.getDefaultParticipant(new_game);

            this.setState({ new_game, participant: newDefault });
        }
    }

    removeParticipants(index) {
        return () => {
            const { new_game } = this.state;

            _.pullAt(new_game.participants, index);
            const newDefault = this.getDefaultParticipant(new_game);

            this.setState({ new_game, participant: newDefault });
        };
    }

/******************
 *
 * Render
 *
 *****************/

    render() {
        const { new_game, participant, error } = this.state;
        const { gametypes, game, users } = this.props;
        const users_options = _.chain(users)
            .sortBy('name')
            .reject(user => !!_.find(new_game.participants, user))
            .map(user => <option key={ user.uid } value={ user.uid }>{ user.name }</option>)
            .defaultTo('')
            .value();
        const participants = new_game.participants.map((user, index) => (
            <li key={ user.uid } >
                { user.name } <button type="button" onClick={ this.removeParticipants(index) }>-</button>
            </li>
        ));

        const types_options = gametypes.map(type => <option key={ type.uid } value={ type.uid }>{ type.name }</option>);

        return (
            <form onSubmit={ this.onFormSubmit }>
                { error && <p>{error}</p> }
                <h3>Participants</h3>
                <ul>
                    { _.isEmpty(new_game.participants) ? 'Select some users to participate in your game.' : participants }
                </ul>

                <select value={ participant.uid } name="participants" onChange={ this.handleParticipantsChange }>
                    { users_options }
                </select>
                <button type="button" onClick={ this.addParticipants }>Add participants</button>

                <label htmlFor="game_type">Game type:</label>
                <select value={ new_game.game_type } name="game_type" onChange={ this.handleValueChange }>
                    { types_options }
                </select>

                <button type="submit">{ _.isEmpty(game) ? 'Start game' : 'Update game' }</button>
            </form>
        );
    }
}

GameForm.propTypes = {
    onGameCreated: PropTypes.func.isRequired,
    game: PropTypes.object,
    gametypes: PropTypes.array,
    users: PropTypes.array,
};

GameForm.defaultProps = {
    game: {},
    gametypes: [],
    users: [],
};

export default GameForm;
