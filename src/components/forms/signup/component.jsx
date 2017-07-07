import React from 'react';
import PropTypes from 'prop-types';

import Validate from '../../../helpers/validate';
import general_style from '../../../common/general.css';
import styles from './style.css';

class UserSignup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newUser: {
                name: '',
                email: '',
                size: 0,
                password: '',
            },
            error: [],
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }

    onFormSubmit(event) {
        const { newUser } = this.state;
        const { onSignup } = this.props;
        event.preventDefault();

        const validate = new Validate();
        validate
            .isset(newUser.name, 'Name is required!')
            .isset(newUser.password, 'Password is required!')
            .validate((error) => {
                if (error) {
                    this.setState({ error });
                } else {
                    onSignup(newUser);
                }
            });
    }

    inputChange(label) {
        return (event) => {
            const { newUser } = this.state;
            newUser[label] = event.target.value;
            this.setState({ newUser, error: [] });
        };
    }

    render() {
        const { newUser, error } = this.state;
        const errorMsgs = error ? error.map((errorMsg, index) => {
            const key = `error${index}`;
            return <p key={ key } className={ general_style.errorMsg }>{ errorMsg }</p>;
        }) : null;

        return (
            <div>
                { errorMsgs }
                <form onSubmit={ this.onFormSubmit }>
                    <label htmlFor="name">User Name:</label>
                    <input type="text" id="name" placeholder="User name" value={ newUser.name } onChange={ this.inputChange('name') } />
                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" placeholder="Email" value={ newUser.email } onChange={ this.inputChange('email') } />
                    <label htmlFor="name">Shoe size:</label>
                    <input type="number" id="size" placeholder="Size" value={ newUser.size } onChange={ this.inputChange('size') } />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" placeholder="Password" value={ newUser.password } onChange={ this.inputChange('password') } />
                    <button className={ styles.signupButton } type="submit">Sign Up</button>
                </form>
            </div>
        );
    }
}

UserSignup.propTypes = {
    onSignup: PropTypes.func.isRequired,
};

export default UserSignup;
