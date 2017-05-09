import React from 'react';
import PropTypes from 'prop-types';

class CreateMatchForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: ['', ''],
            error: ''
        }

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onPlayerChange = this.onPlayerChange.bind(this);
        this.addPlayer = this.addPlayer.bind(this);
    }

    onFormSubmit(event) {
        const {players} = this.state;
        event.preventDefault();

        if (_.every(players, (player) => player !== '')) {
            this.props.onMatchCreate({players});

            this.setState({ players: players.map((player) => '') });
        } else {
            this.setState({error: 'You have to name all the players.'});
        }
    }

    addPlayer() {
        const { players } = this.state;
        this.setState({ 
                players: players.concat(['']), 
                error: '' 
            });
    }

    removePlaye(index) {
        return () => {
            const { players } = this.state;
            _.pullAt(players, index);
            this.setState({ 
                players, 
                error: '' 
            });
        }
    }

    onPlayerChange(index) {
        return (event) => {
            const { players } = this.state;
            players.splice(index, 1, event.target.value);
            this.setState({ 
                players, 
                error: '' 
            });
        }
    }

    render() {
        const {players, error} = this.state;
        const inputs = players.map((value, index) => (
            <div key={index}>
                <input type="text" value={value} ref={`player-${index}`} onChange={this.onPlayerChange(index)} />
                <button type="button" onClick={this.removePlaye(index)}>-</button>
            </div>
        ));

        return (
            <form onSubmit={this.onFormSubmit}>
                {error && <p>{error}</p>}
                {inputs}
                <button type="button" onClick={this.addPlayer}>add player</button>
                <button type="submit">Start Game</button>
            </form>
        )
    }
}

CreateMatchForm.PropTypes = {
    onMatchCreate: PropTypes.func
}

export default CreateMatchForm;