import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import _ from 'lodash';

import styles from './style.css';

const GamesList = (props) => {
    const { onGameRemoved, games } = props;
    const listItems = games.map((game) => {
        const { players, score, uid, winner } = game;
        const formatedPlayerList = _.chain(players)
            .map((p, i) => (winner[i] ? `_${p}_` : p))
            .join(' vs. ')
            .value();
        return (
            <li key={ uid }>
                { formatedPlayerList } { score.join('-') }
                <Link to={ `score/${uid}` }>Report score</Link>
                <Link to={ `game/${uid}` }>Edit</Link>
                <button type="button" onClick={ onGameRemoved(uid) }>-</button>
            </li>
        );
    });

    return (
        <div >
            <h3> Games </h3>
            <ul className={ styles.gameslist }>{ listItems }</ul>
        </div>
    );
};

GamesList.propTypes = {
    games: PropTypes.array.isRequired,
    onGameRemoved: PropTypes.func.isRequired,
};

export default GamesList;
