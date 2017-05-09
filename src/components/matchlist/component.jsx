import React from 'react';
import PropTypes from 'prop-types';

import styles from "./style.css";

class MatchList extends React.Component {
    render() {
        const listItems = this.props.matches.map(
            (match, i) => (
                <li key={i} >
                    {match.players.join(' vs. ')}
                </li>
            )
        );
        return (
            <div >
                <h3> Matches </h3>
                <ul className={styles.matchlist}>{listItems}</ul> 
            </div>
        );
    }
}

MatchList.PropTypes = {
    matches: PropTypes.array
}

export default MatchList;