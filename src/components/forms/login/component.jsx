import React from 'react';
import PropTypes from 'prop-types';

import Validate from '../../validate';
import general_style from '../../../common/general.css';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                name: '',
                password: '',
            },
            error: [],
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }

    onFormSubmit(event) {
        const { user } = this.state;
        const { onLogin } = this.props;

        event.preventDefault();

        const validate = new Validate();
        validate
            .isset(user.name, 'Name is missing!')
            .isset(user.password, 'Password is missing!')
            .validate((error) => {
                if (error) {
                    this.setState({ error });
                } else {
                    onLogin(user);
                }
            });
    }

    inputChange(label) {
        return (event) => {
            const { user } = this.state;
            user[label] = event.target.value;
            this.setState({ user, error: [] });
        };
    }

    render() {
        const { user, error } = this.state;
        const errorMsgs = error ? error.map((errorMsg, index) => {
            const key = `error${index}`;
            return <p key={ key } className={ general_style.errorMsg }>{ errorMsg }</p>;
        }) : null;

        return (
            <div>
                { errorMsgs }
                <form onSubmit={ this.onFormSubmit }>
                    <label htmlFor="name">User Name:</label>
                    <input type="text" id="name" placeholder="User name" value={ user.name } onChange={ this.inputChange('name') } />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" placeholder="Password" value={ user.password } onChange={ this.inputChange('password') } />
                    <button type="submit">Log In</button>
                </form>
            </div>
        );
    }
}

LoginForm.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default LoginForm;
