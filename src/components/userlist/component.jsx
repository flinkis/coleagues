import React from 'react';
import PropTypes from 'prop-types';

import styles from "./style.css";

const UserList = (props) => {
    const { users, user } = props;
    const listItems = users.map(
        (u, i) => {
            return (user && u.uid === user.uid) ?
                <li key={i} className={styles.active}>{u.name}</li> :
                <li key={i}>{u.name}</li>;
        }
    );

    return (
        <div >
            <h3> Online Users </h3>
            <ul className={styles.userlist}>{listItems}</ul> 
        </div>
    );
}

UserList.PropTypes = {
    users: PropTypes.array.isRequired,
    user: PropTypes.obj
}

export default UserList;
