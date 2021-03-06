import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import styles from './styles.css';

import CreateTournamnentForm from '../../components/forms/tournament/component';

class TournamnetPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tournaments: [],
            tournament: {},
            gametypes: [],
            tournamentType: [],
            users: [],
        };

        this.handleTournamentChange = this.handleTournamentChange.bind(this);
        this.handleTournamentEdit = this.handleTournamentEdit.bind(this);
        this.handleTournamentDuplicate = this.handleTournamentDuplicate.bind(this);
        this.handleTournamentRemove = this.handleTournamentRemove.bind(this);

        this.removeTournament = this.removeTournament.bind(this);
        this.updateTournament = this.updateTournament.bind(this);
    }

    componentDidMount() {
        const { socket } = this.props;

        socket.on('tournament:remove', this.removeTournament);
        socket.on('tournament:update', this.updateTournament);

        socket.emit('tournament:request', (response) => {
            const { tournaments } = response;

            this.setState({ tournaments });
        });

        socket.emit('gametype:request', (response) => {
            const { gametypes } = response;

            this.setState({ gametypes });
        });

        socket.emit('user:request', (response) => {
            const { users } = response;

            this.setState({ users });
        });
    }

    componentWillUnmount() {
        const { socket } = this.props;

        socket.off('tournament:remove', this.removeTournament);
        socket.off('tournament:update', this.updateTournament);
    }

    /******************
    *
     * Setup Socket connection
     *
     *****************/

    removeTournament(response) {
        const { tournaments } = this.state;
        const { uid } = response;
        const newTournamentList = _.reject(tournaments, { uid });

        this.setState({ tournaments: newTournamentList });
    }

    updateTournament(tournament) {
        const { tournaments } = this.state;
        const oldTournament = _.find(tournaments, { uid: tournament.uid });

        if (oldTournament) {
            const index = tournaments.indexOf(oldTournament);
            tournaments.splice(index, 1, tournament);
        } else {
            tournaments.push(tournament);
        }

        this.setState({ tournaments });
    }

    /******************
     *
     * Handlers
     *
     *****************/

    handleTournamentChange(tournament) {
        const { socket } = this.props;

        socket.emit('tournament:update', tournament, (response) => {
            const { tournaments } = response;

            this.setState({
                tournaments,
                tournament: {},
            });
        });
    }

    handleTournamentEdit(uid) {
        return () => {
            const { socket } = this.props;

            socket.emit('tournament:getById', { uid }, (response) => {
                const { tournament } = response;

                this.setState({ tournament });
            });
        };
    }

    handleTournamentDuplicate(uid) {
        return () => {
            const { socket } = this.props;

            socket.emit('tournament:getById', { uid }, (response) => {
                const { tournament } = response;

                tournament.uid = null;

                this.setState({ tournament });
            });
        };
    }

    handleTournamentRemove(uid) {
        return () => {
            const { tournaments } = this.state;
            const { socket } = this.props;
            const newTournamentList = _.reject(tournaments, { uid });

            this.setState({ tournaments: newTournamentList });
            socket.emit('tournament:remove', { uid });
        };
    }

    /******************
     *
     * Render
     *
     *****************/

    render() {
        const { tournaments, tournament, gametypes, tournamentType, users } = this.state;
        const listItems = tournaments.map((item) => {
            const { name, description, uid } = item;
            return (
                <li className={ styles.listitem } key={ uid }>
                    <h4>{ name }</h4>
                    <p>{ description }</p>
                    <div className={ styles.actions }>
                        <button type="button" onClick={ this.handleTournamentEdit(uid) }>edit</button>
                        <button type="button" onClick={ this.handleTournamentDuplicate(uid) }>duplicate</button>
                        <button type="button" onClick={ this.handleTournamentRemove(uid) }>remove</button>
                    </div>
                </li>
            );
        });

        return (
            <div className="hg__main">
                <CreateTournamnentForm
                    onTournamentChange={ this.handleTournamentChange }
                    selectedTournament={ tournament }
                    gameTypes={ gametypes }
                    tournamentType={ tournamentType }
                    users={ users }
                />

                <div className="block">
                    <h3>Tournaments</h3>
                    <ul className={ styles.liststyle }>
                        { listItems }
                    </ul>
                </div>
            </div>
        );
    }
}

TournamnetPage.propTypes = {
    socket: PropTypes.object.isRequired,
};

export default TournamnetPage;
