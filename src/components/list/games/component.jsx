import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import _ from 'lodash';

import styles from './style.css';
import general_style from '../../../style/general.css';

const GamesList = (props) => {
    const { onGameRemoved, games } = props;
    const listItems = games.map((game) => {
        const { participants, uid } = game;
        const players = _.chain(participants).map(item => `${item.name} (${item.score || 0})`).join(' vs. ').value();

        return (
            <li className={ styles.gameslist } key={ uid }>
                <Link to={ `score/${uid}` }>{ players }</Link>
                <Link to={ `game/${uid}` }>Edit</Link>
                <span role="button" tabIndex="0" onClick={ onGameRemoved(uid) }>Remove</span>
            </li>
        );
    });

    return (
        <div >
            <h3> Games </h3>
            <ul className={ general_style.list }>
                { listItems }
            </ul>
        </div>
    );
};

GamesList.propTypes = {
    games: PropTypes.array.isRequired,
    onGameRemoved: PropTypes.func.isRequired,
};

export default GamesList;
