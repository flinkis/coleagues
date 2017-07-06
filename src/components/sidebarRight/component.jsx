import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';

import Auth from '../../components/auth';
import LoginForm from '../../components/forms/login/component';
import UserList from '../../components/list/users/component';

import styles from './style.css';

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            users: [],
            user: {},
        };

        this.initialize = this.initialize.bind(this);

        this.handleUserLogin = this.handleUserLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.userLeft = this.userLeft.bind(this);
        this.userChanged = this.userChanged.bind(this);
    }

    componentDidMount() {
        const { socket } = this.props;
        const { user } = this.state;

        socket.on('init', this.initialize);
        socket.on('user:left', this.userLeft);
        socket.on('user:update', this.userChanged);

        Auth.handleAuthentication(socket, (authenticatedUser) => {
            if (authenticatedUser && authenticatedUser !== user) {
                socket.emit('user:update', { newUser: authenticatedUser });
                socket.emit('refresh');
                this.setState({ loggedIn: true });
            }
        });
    }

    initialize(response) {
        const { user, users } = response;

        this.setState({ user, users });
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
                { loggedIn || <h2 className={ styles.lead }>Create an account to get started!</h2> }
                { loggedIn || <Link className={ styles.link } to="/signup">Sign up</Link> }

                <h2>{ !loggedIn ? 'Log In' : `Hello ${user.name}` }</h2>

                { !loggedIn ?
                    <LoginForm onLogin={ this.handleUserLogin } /> :
                    <button onClick={ this.handleLogout }>Log out</button>
                }

                <UserList users={ users } user={ user } />
            </aside>
        );
    }
}

Sidebar.propTypes = {
    socket: PropTypes.object.isRequired,
};

export default Sidebar;
