import React from 'react';
import PropTypes from 'prop-types';

import styles from './style.css';

const UserList = (props) => {
    const { users, user } = props;
    const listItems = users.map(u => <li key={ u.uid } className={ u.uid === user.uid && styles.active }>{ u.name }</li>);

    return (
        <div >
            <h3> Online Users </h3>
            <ul className={ styles.userlist }>{ listItems }</ul>
        </div>
    );
};

UserList.propTypes = {
    users: PropTypes.array.isRequired,
    user: PropTypes.object,
};

UserList.defaultProps = {
    user: {
        uid: '',
    },
};

export default UserList;
