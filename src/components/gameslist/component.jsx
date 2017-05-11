import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import styles from "./style.css";

const GamesList = (props) => {
    const { onGameRemoved, games } = props;
    const listItems = games.map(
        (game, i) => {
            const {players, score, uid} = game;
            return (
                <li key={i}>
                    {players.join(' vs. ')} {score.join('-')}
                    <Link to={`/score/${ uid }`}>Report score</Link>
                    <button type="button" onClick={onGameRemoved(uid)}>-</button>
                </li>
            );
        }
    );
    return (
        <div >
            <h3> Games </h3>
            <ul className={styles.gameslist}>{listItems}</ul> 
        </div>
    );
}

GamesList.PropTypes = {
    games: PropTypes.array,
    onGameRemoved: PropTypes.func
}

export default GamesList;