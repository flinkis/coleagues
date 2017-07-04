import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import _ from 'lodash';

import Auth from '../../auth';

import ParticipantList from '../../components/list/participants/component';
import GamesList from '../../components/list/games/component';

class TournamnetList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tournament: {},
            authenticatedUser: {},
            games: [],
        };

        this.signup = this.signup.bind(this);
        this.startTournament = this.startTournament.bind(this);
    }

    componentWillMount() {
        const { socket } = this.props.route;
        const { uid } = this.props.params;

        socket.emit('tournament:getById', { uid }, (result) => {
            const { tournament } = result;
            if (tournament) {
                socket.emit('game:request', (games) => {
                    this.setState({
                        games: _.filter(games, { tournament: tournament.uid }),
                        tournament,
                    });
                });
            }
        });

        socket.on('tournament:update', (tournament) => {
            if (tournament.uid === uid) {
                this.setState({ tournament });
            }
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
        const { socket } = this.props.route;

        tournament.active = true;

        socket.on('tournament:start', { tournament, type: 'robin' }, (respons) => {
            if (respons) {
                const { games } = respons;
                this.setState({
                    games: _.filter(games, { tournament: tournament.uid }),
                    tournament,
                });
            }
        });
    }

    render() {
        const { tournament, authenticatedUser, games } = this.state;

        return (
            <div>
                <h1> { tournament.name } </h1>
                <Link to="/">Home</Link>
                <p> { tournament.description } </p>
                <p> Start Date: { tournament.start_date } </p>
                <p> End Date: { tournament.end_date } </p>

                { !tournament.active && <button type="button" onClick={ this.startTournament }>Lock players and start tournament</button> }
                <ParticipantList authenticatedUser={ authenticatedUser } tournament={ tournament } signup={ this.signup } />
                <GamesList games={ games } />
            </div>
        );
    }
}

TournamnetList.propTypes = {
    route: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
};

export default TournamnetList;
