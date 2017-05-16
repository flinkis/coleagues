import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import CreateTournamnentForm from '../../components/forms/tournament/component';

class TournamnetPage extends React.Component {
    constructor(props) {
        super(props);

        this.handleTournamentCreated = this.handleTournamentCreated.bind(this);
    }

/******************
 *
 * Handelers
 *
 *****************/

    handleTournamentCreated() {
        this.setState({
            go: 1,
        });
    }


    render() {
        return (
            <div>
                <h1>Create Tournament</h1>
                <Link to="/">Go Home</Link>
                <CreateTournamnentForm onTournamentCreate={ this.handleTournamentCreated } />
            </div>
        );
    }
}

TournamnetPage.PropTypes = {
    socket: PropTypes.object.isRequired,
};

export default TournamnetPage;
