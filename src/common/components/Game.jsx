import React from 'react';
import PropTypes from 'prop-types';

class Game extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			players: ['', '']
		}
	}

	onFormSubmit() {

	}

	onPlayerChange(index, event) {
		// this.setState({
		//   players: this.state.players.splice(index, 1, event.target.value)
		// });
	}

	render() {
		const inputs = this.state.players.map((value, index) => (
			<input key={index} name={`player-${index}`} type="text" value={value} onChange={this.onPlayerChange.bind(this, index, event)} />				
		));

		return (
			<form onSubmit={this.onFormSubmit.bind(this)}>
				{inputs}
				<button type="submit">Start Game</button>
			</form>
		)
	}
}

export default Game;