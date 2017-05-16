import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class CreateGameForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: ['', ''],
            gametype: '',
            uid: '',
            score: [0, 0],
            error: '',
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onPlayerChange = this.onPlayerChange.bind(this);
        this.addPlayer = this.addPlayer.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { game } = nextProps;

        if (!_.isEmpty(game)) {
            const { players, gametype, uid, score } = game;

            this.setState({ players, gametype, uid, score });
        }
    }

/******************
 *
 * Handelers
 *
 *****************/

    onFormSubmit(event) {
        const { players, gametype, uid, score } = this.state;
        event.preventDefault();

        if (_.every(players, player => player !== '')) {
            this.props.onGameCreated({
                players,
                gametype,
                uid,
                score,
            });
        } else {
            this.setState({ error: 'You have to name all the players.' });
        }
    }

    onPlayerChange(index) {
        return (event) => {
            const { players } = this.state;
            players.splice(index, 1, event.target.value);
            this.setState({
                players,
                error: '',
            });
        };
    }

    removePlayer(index) {
        return () => {
            const { players } = this.state;
            _.pullAt(players, index);
            this.setState({
                players,
                error: '',
            });
        };
    }

    addPlayer() {
        const { players, score } = this.state;
        this.setState({
            players: players.concat(['']),
            score: score.concat([0]),
            error: '',
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({ [name]: value, error: '' });
    }


/******************
 *
 * Render
 *
 *****************/

    render() {
        const { players, gametype, error } = this.state;
        const { gametypes, game } = this.props;

        const inputs = players.map((value, i) => {
            const uid = `input${i}`;
            return (
                <div key={ uid }>
                    <input type="text" value={ value } onChange={ this.onPlayerChange(i) } />
                    <button type="button" onClick={ this.removePlayer(i) }>-</button>
                </div>
            );
        });
        const options = gametypes.map(type => <option key={ type.uid } value={ type.uid }>{ type.name }</option>);

        return (
            <form onSubmit={ this.onFormSubmit }>
                { error && <p>{error}</p> }
                { inputs }
                <select value={ gametype } name="gametype" onChange={ this.handleChange }>
                    { options }
                </select>
                <button type="button" onClick={ this.addPlayer }>add player</button>
                <button type="submit">{ _.isUndefined(game.uid) ? 'Start game' : 'Update game' }</button>
            </form>
        );
    }
}

CreateGameForm.propTypes = {
    onGameCreated: PropTypes.func.isRequired,
    game: PropTypes.object,
    gametypes: PropTypes.array,
};

CreateGameForm.defaultProps = {
    game: {},
    gametypes: [],
};

export default CreateGameForm;
