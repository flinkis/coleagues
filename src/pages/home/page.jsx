import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import GamesList from '../../components/list/games/component';
import TournamentsList from '../../components/list/tournaments/component';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            games: [],
            tournaments: [],
        };

        this.initialize = this.initialize.bind(this);
        this.removeGame = this.removeGame.bind(this);
        this.updateGames = this.updateGames.bind(this);
        this.updateTournaments = this.updateTournaments.bind(this);
        this.removeTournament = this.removeTournament.bind(this);

        this.handleGameRemoved = this.handleGameRemoved.bind(this);
    }

/******************
 *
 * Setup Socket connection
 *
 *****************/

    componentWillMount() {
        const { socket } = this.props;

        socket.emit('refresh');
    }

    componentDidMount() {
        const { socket } = this.props;

        socket.on('init', this.initialize);

        socket.on('game:remove', this.removeGame);
        socket.on('game:update', this.updateGames);
        socket.on('tournament:update', this.updateTournaments);
        socket.on('tournament:remove', this.removeTournament);
    }

    componentWillUnmount() {
        const { socket } = this.props;

        socket.off('init', this.initialize);
    }

    initialize(response) {
        const { games, tournaments } = response;

        this.setState({
            games,
            tournaments,
        });
    }

    removeGame(response) {
        const { games } = this.state;
        const { uid } = response;
        const newGames = _.reject(games, { uid });

        this.setState({ games: newGames });
    }

    updateGames(game) {
        const { games } = this.state;
        const oldGame = _.find(games, { uid: game.uid });

        if (oldGame) {
            games.splice(games.indexOf(oldGame), 1, game);
        } else {
            games.push(game);
        }

        this.setState({ games });
    }

    updateTournaments(tournament) {
        const { tournaments } = this.state;
        const oldTournament = _.find(tournaments, { uid: tournament.uid });

        if (oldTournament) {
            tournaments.splice(tournaments.indexOf(oldTournament), 1, tournament);
        } else {
            tournaments.push(tournament);
        }

        this.setState({ tournaments });
    }

    removeTournament(response) {
        const { tournaments } = this.state;
        const { uid } = response;
        const newTournaments = _.reject(tournaments, { uid });

        this.setState({ tournaments: newTournaments });
    }

    handleGameRemoved(uid) {
        return () => {
            const { games } = this.state;
            const { socket } = this.props;
            const newGames = _.reject(games, { uid });

            this.setState({ games: newGames });
            socket.emit('game:remove', { uid });
        };
    }

/******************
 *
 * Render
 *
 *****************/

    render() {
        const { games, tournaments } = this.state;

        return (
            <div className="hg__main">
                <TournamentsList tournaments={ tournaments } />
                <GamesList games={ games } onGameRemoved={ this.handleGameRemoved } edit />
            </div>
        );
    }
}

HomePage.propTypes = {
    socket: PropTypes.object.isRequired,
};

export default HomePage;
