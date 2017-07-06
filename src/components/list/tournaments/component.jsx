import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './style.css';
import general_style from '../../../common/general.css';

const Tournamentlist = (props) => {
    const listItems = props.tournaments.map((tournament) => {
        const { name, uid } = tournament;
        return (
            <li className={ styles.tournamentlist } key={ uid }>
                <Link to={ `tournament/${uid}` }>{ name }</Link>
            </li>
        );
    });

    return (
        <div >
            <h3> Tournaments </h3>
            <ul className={ general_style.list }>
                { listItems }
            </ul>
        </div>
    );
};

Tournamentlist.propTypes = {
    tournaments: PropTypes.array.isRequired,
};

export default Tournamentlist;
