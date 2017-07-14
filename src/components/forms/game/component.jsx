import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Validate from '../../../helpers/validate';
import general_style from '../../../common/general.css';

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
            error: [],
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.getDefaultParticipant = this.getDefaultParticipant.bind(this);
        this.handleParticipantsChange = this.handleParticipantsChange.bind(this);
        this.onAddParticipant = this.onAddParticipant.bind(this);
        this.onRemoveParticipant = this.onRemoveParticipant.bind(this);
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
        const { onGameCreated } = this.props;
        event.preventDefault();

        const validate = new Validate();

        validate
            .length(new_game.participants, 'You have to have at least one participant!')
            .validate((error) => {
                if (error) {
                    this.setState({ error });
                } else {
                    onGameCreated({ ...new_game });
                }
            });
    }

    onAddParticipant() {
        const { new_game, participant } = this.state;

        if (!_.isEmpty(participant)) {
            new_game.participants.push(participant);
            const newDefault = this.getDefaultParticipant(new_game);

            this.setState({ new_game, participant: newDefault, error: [] });
        }
    }

    onRemoveParticipant(index) {
        return () => {
            const { new_game } = this.state;

            _.pullAt(new_game.participants, index);
            const newDefault = this.getDefaultParticipant(new_game);

            this.setState({ new_game, participant: newDefault, error: [] });
        };
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
                { user.name } <button type="button" onClick={ this.onRemoveParticipant(index) }>-</button>
            </li>
        ));
        const types_options = gametypes.map(type => <option key={ type.uid } value={ type.uid }>{ type.name }</option>);
        const errorMsgs = error ? error.map((errorMsg, index) => {
            const key = `error${index}`;
            return <p key={ key } className={ general_style.errorMsg }>{ errorMsg }</p>;
        }) : null;

        return (
            <form onSubmit={ this.onFormSubmit } className="block">
                { errorMsgs }
                <h3>Participants</h3>
                <ul>
                    { _.isEmpty(new_game.participants) ? 'Select some users to participate in your game.' : participants }
                </ul>

                <select value={ participant.uid } name="participants" onChange={ this.handleParticipantsChange }>
                    { users_options }
                </select>
                <button type="button" onClick={ this.onAddParticipant }>Add participants</button>

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
