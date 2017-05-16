import React from 'react';
import PropTypes from 'prop-types';

class CreateTournamnentForm extends React.Component {
    constructor(props) {
        super(props);

        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormSubmit(event) {
        const { onTournamentCreate } = this.props;
        event.preventDefault();

        onTournamentCreate();
    }

    render() {
        return (
            <form onSubmit={ this.onFormSubmit }>
                CreateTournamnentForm
                <button type="submit">Start Game</button>
            </form>
        );
    }
}

CreateTournamnentForm.propTypes = {
    onTournamentCreate: PropTypes.func.isRequired,
};

export default CreateTournamnentForm;
