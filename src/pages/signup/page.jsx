import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UserSignup from '../../components/forms/signup/component';
import Auth from '../../helpers/auth';

class SignupPage extends Component {
    constructor(props) {
        super(props);

        this.handleSignup = this.handleSignup.bind(this);
    }

    /******************
     *
     * Handlers
     *
     *****************/

    handleSignup(newUser) {
        const { socket, history } = this.props;

        Auth.signup(newUser, socket, (response) => {
            if (response) {
                history.push('/');
            } else {
                alert('Unable to create account, please try another username');
            }
        });
    }

    /******************
     *
     * Render
     *
     *****************/

    render() {
        return (
            <div className="hg__main">
                <UserSignup onSignup={ this.handleSignup } />
            </div>
        );
    }
}

SignupPage.propTypes = {
    socket: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default SignupPage;
