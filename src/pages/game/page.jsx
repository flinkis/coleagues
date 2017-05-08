import React from 'react';
import Game from '../../common/components/Game';
import { browserHistory } from 'react-router';

export default class GamePage extends React.Component {
  goHome() {
    browserHistory.push('/');
  }
  
  render() {
    return (
      <div>
        <h1>Create Game</h1>
        <p>Create a game and get started!</p>
        <button onClick={this.goHome}>Go Home</button>

        <Game />
      </div>
    );
  }
}