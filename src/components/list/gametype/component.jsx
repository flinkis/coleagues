import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './style.css';

const GameTypeList = (props) => {
    const { gametypes, onEdit, onRemove, scoring } = props;
    const listItems = gametypes.map((current) => {
        const { name, description, type, uid } = current;
        const score = _.find(scoring, { uid: type });
        return (
            <li className={ styles.listItem } key={ uid }>
                <span>{ name }</span>
                <span>{ description }</span>
                <span>{ score && score.name }</span>
                <div className={ styles.action }>
                    <button type="button" onClick={ onEdit(uid) }>edit</button>
                    <button type="button" onClick={ onRemove(uid) }>remove</button>
                </div>
            </li>
        );
    });

    return (
        <div className="block">
            <h3> Games Type </h3>
            <ul className={ styles.list }>
                { listItems }
            </ul>
        </div>
    );
};

GameTypeList.propTypes = {
    gametypes: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    scoring: PropTypes.array,
};

GameTypeList.defaultProps = {
    scoring: [],
};

export default GameTypeList;
