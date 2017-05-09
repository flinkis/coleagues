import React from 'react';
import PropTypes from 'prop-types';

import styles from "./style.css";

class UserList extends React.Component {
    render() {
        const listItems = this.props.users.map(
            (user, i) => (<li key={i} className={user === this.props.name && styles.active}>{user}</li>)
        );
        return (
            <div >
                <h3> Online Users </h3>
                <ul className={styles.userlist}>{listItems}</ul> 
            </div>
        );
    }
}

UserList.PropTypes = {
    users: PropTypes.array.isRequired,
    name: PropTypes.string
}

export default UserList;
