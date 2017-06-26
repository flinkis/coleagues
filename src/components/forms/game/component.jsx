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
            winner: ['', ''],
            error: '',
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onPlayerChange = this.onPlayerChange.bind(this);
        this.addPlayer = this.addPlayer.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { game } = nextProps;

        if (!_.isEmpty(game)) {
            this.setState({ ...game });
        }
    }

/******************
 *
 * Handelers
 *
 *****************/

    onFormSubmit(event) {
        const { players, gametype, uid, score, winner } = this.state;
        event.preventDefault();

        if (_.every(players, player => player !== '')) {
            this.props.onGameCreated({ players, gametype, uid, score, winner });
        } else {
            this.setState({ error: 'You have to give a name to all contendants.' });
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
            const { players, score, winner } = this.state;

            _.pullAt(players, index);
            _.pullAt(score, index);
            _.pullAt(winner, index);

            this.setState({
                players,
                score,
                winner,
                error: '',
            });
        };
    }

    addPlayer() {
        const { players, score, winner } = this.state;

        this.setState({
            players: players.concat(['']),
            score: score.concat([0]),
            winner: winner.concat(['']),
            error: '',
        });
    }

    handleChangeValueValue(event) {
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
            const key = `input${i}`;
            return (
                <div key={ key }>
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
                <select value={ gametype } name="gametype" onChange={ this.handleChangeValue }>
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
