import React from 'react';
import PropTypes from 'prop-types';

class Users extends React.Component {
    render() {
        const listItem = this.props.users.map(
            (user, i) => (<li key={i}>{user}</li>)
        );
        return (
            <div className='users'>
                <h3> Online Users </h3>
                <ul>{listItem}</ul> 
            </div>
        );
    }
}

Users.PropTypes = {
    users: PropTypes.array.isRequired
}

export default Users;
