import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Auth from '../../helpers/auth';
import LoginForm from '../forms/login/component';
import UserList from '../list/users/component';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            users: [],
            user: {},
        };

        this.handleUserLogin = this.handleUserLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.userLeft = this.userLeft.bind(this);
        this.userChanged = this.userChanged.bind(this);
    }

    componentWillMount() {
        const { socket } = this.props;

        socket.on('user:left', this.userLeft);
        socket.on('user:update', this.userChanged);

        socket.emit('user:current', (users) => {
            this.setState({ users });
        });

        socket.emit('user:request', (user) => {
            Auth.handleAuthentication(socket, (authenticatedUser) => {
                if (authenticatedUser && authenticatedUser.id !== user.id) {
                    socket.emit('user:update', { newUser: authenticatedUser });
                    this.setState({
                        user: authenticatedUser,
                        loggedIn: true,
                    });
                } else {
                    this.setState({ user });
                }
            });
        });
    }

    userLeft(response) {
        const { users } = this.state;
        const { uid } = response;

        this.setState({ users: _.reject(users, { uid }) });
    }

    userChanged(response) {
        const { user, newUser } = response;
        const { users } = this.state;
        let newUserList = users;

        if (user) {
            newUserList = _.remove(users, u => u.uid !== user.uid);
        }
        newUserList.push(newUser);

        this.setState({
            users: newUserList,
        });
    }

/******************
 *
 * Handlers
 *
 *****************/

    handleUserLogin(data) {
        const { users, user } = this.state;
        const { socket } = this.props;

        Auth.login(data, user, socket, (loggedInUser) => {
            const index = users.indexOf(user);

            users.splice(index, 1, loggedInUser);

            this.setState({
                user: loggedInUser,
                users,
                loggedIn: true,
            });
        });
    }

    handleLogout() {
        const { users, user } = this.state;
        const { socket } = this.props;

        Auth.logout(socket, user, () => {
            socket.emit('user:getNewGuest', (result) => {
                const { newUser } = result;
                const index = users.indexOf(user);

                users.splice(index, 1, newUser);
                this.setState({
                    user: newUser,
                    users,
                    loggedIn: false,
                });
            });
        });
    }

/******************
 *
 * Render
 *
 *****************/

    render() {
        const { users, user, loggedIn } = this.state;

        return (
            <aside className="hg__right">
                <UserList users={ users } user={ user } />

                { loggedIn ? <h3> {`Hello ${user.name}`} </h3> : <h2>Log In</h2> }

                { !loggedIn ?
                    <LoginForm onLogin={ this.handleUserLogin } /> :
                    <button onClick={ this.handleLogout }>Log out</button>
                }
            </aside>
        );
    }
}

Sidebar.propTypes = {
    socket: PropTypes.object.isRequired,
};

export default Sidebar;
