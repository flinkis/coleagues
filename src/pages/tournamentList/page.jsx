import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import _ from 'lodash';
import Auth from '../../auth';

class TournamnetList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tournament: {},
            authenticatedUser: {},
        };

        this.signup = this.signup.bind(this);
        this.startTournament = this.startTournament.bind(this);
    }

    componentWillMount() {
        const { socket } = this.props.route;
        const { uid } = this.props.params;

        socket.emit('tournament:getById', { uid }, (result) => {
            const { tournament } = result;
            this.setState({ tournament });
        });

        socket.on('tournament:update', (tournament) => {
            this.setState({ tournament });
        });

        Auth.handleAuthentication(socket, (authenticatedUser) => {
            if (authenticatedUser) {
                this.setState({ authenticatedUser });
            }
        });
    }

    signup() {
        const { tournament, authenticatedUser } = this.state;
        const { socket } = this.props.route;

        if (!_.isEmpty(authenticatedUser.uid) && !_.some(tournament.participants, ['uid', authenticatedUser.uid])) {
            tournament.participants.push(authenticatedUser);

            socket.emit('tournament:update', tournament, () => {
                this.setState({ tournament });
            });
        }
    }

    startTournament() {
        const { tournament } = this.state;
        tournament.active = true;

        this.setState({ tournament });
    }

    render() {
        const { tournament, authenticatedUser } = this.state;
        const participating = !_.isEmpty(authenticatedUser) && !_.some(tournament.participants, ['uid', authenticatedUser.uid]);
        const participantList = _.isEmpty(tournament.participants) ?
            null : tournament.participants.map(participant => <li key={ participant.uid }>{ participant.name }</li>);

        return (
            <div>
                <h1> { tournament.name } </h1>
                <Link to="/">Home</Link>
                <p> { tournament.description } </p>
                <p> Start Date: { tournament.start_date } </p>
                <p> End Date: { tournament.end_date } </p>

                { participating &&
                    <div>
                        <p>Loged in as { authenticatedUser.name }</p>
                        <button onClick={ this.signup }>Sign up</button>
                    </div>
                }
                <h3>Participants</h3>
                <ul>
                    { _.isEmpty(tournament.participants) ? 'No one has signed up play in the tournament.' : participantList }
                </ul>

                { !tournament.active && <button type="button" onClick={ this.startTournament }>Lock players and start tournament</button> }
            </div>
        );
    }
}

TournamnetList.propTypes = {
    route: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
};

export default TournamnetList;
