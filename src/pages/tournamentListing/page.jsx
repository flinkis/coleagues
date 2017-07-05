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
            filterdGames: [],
        };

        this.handleSignup = this.handleSignup.bind(this);
        this.handleTournamentStart = this.handleTournamentStart.bind(this);
        this.updateTournament = this.updateTournament.bind(this);
        this.updateGame = this.updateGame.bind(this);
        this.removeGame = this.removeGame.bind(this);
    }

    componentWillMount() {
        const { socket } = this.props.route;
        const { uid } = this.props.params;

        socket.emit('tournament:getById', { uid }, (result) => {
            const { tournament } = result;

            socket.emit('game:request', (subResult) => {
                const { games } = subResult;
                const filterdGames = _.filter(games, { tournament: tournament.uid });

                this.setState({ filterdGames, tournament });
            });
        });

        socket.on('tournament:update', this.updateTournament);
        socket.on('game:update', this.updateGame);
        socket.on('game:remove', this.removeGame);

        Auth.handleAuthentication(socket, (authenticatedUser) => {
            if (authenticatedUser) {
                this.setState({ authenticatedUser });
            }
        });
    }

    updateTournament(tournament) {
        const { uid } = this.props.params;

        if (tournament.uid === uid) {
            this.setState({ tournament });
        }
    }

    updateGame(game) {
        const { filterdGames } = this.state;
        const oldGame = _.find(filterdGames, { uid: game.uid });

        if (oldGame) {
            filterdGames.splice(filterdGames.indexOf(oldGame), 1, game);
            this.setState({ filterdGames });
        }
    }

    removeGame(response) {
        const { filterdGames } = this.state;
        const { uid } = response;

        this.setState({
            filterdGames: _.reject(filterdGames, { uid }),
        });
    }

    handleSignup() {
        const { tournament, authenticatedUser } = this.state;
        const { socket } = this.props.route;

        if (!_.isEmpty(authenticatedUser.uid) && !_.some(tournament.participants, ['uid', authenticatedUser.uid])) {
            tournament.participants.push(authenticatedUser);

            socket.emit('tournament:update', tournament, () => {
                this.setState({ tournament });
            });
        }
    }

    handleTournamentStart() {
        const { tournament } = this.state;
        const { socket } = this.props.route;

        tournament.active = true;

        socket.emit('tournament:start', { tournament, type: 'robin' }, (respons) => {
            const { games } = respons;
            const filterdGames = _.filter(games, { tournament: tournament.uid });

            this.setState({ filterdGames, tournament });
        });
    }

    render() {
        const { tournament, authenticatedUser, filterdGames } = this.state;

        return (
            <div>
                <h1> { tournament.name } </h1>
                <Link to="/">Home</Link>
                <p> { tournament.description } </p>
                <p> Start Date: { tournament.start_date } </p>
                <p> End Date: { tournament.end_date } </p>

                { !tournament.active && <button type="button" onClick={ this.handleTournamentStart }>Lock players and start tournament</button> }
                <ParticipantList authenticatedUser={ authenticatedUser } tournament={ tournament } signup={ this.handleSignup } />
                <GamesList games={ filterdGames } />
            </div>
        );
    }
}

TournamnetList.propTypes = {
    route: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
};

export default TournamnetList;
