import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import _ from 'lodash';

import styles from './styles.css';

import GameTypeForm from '../../components/forms/gametype/component';

class GameTypePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gametypes: [],
            gametype: {},
            scoring: [],
        };

        this.handleGameTypeChange = this.handleGameTypeChange.bind(this);
        this.handleGameTypeEdit = this.handleGameTypeEdit.bind(this);
        this.handleGameTypeRemove = this.handleGameTypeRemove.bind(this);

        this.removeGameType = this.removeGameType.bind(this);
        this.updateGameType = this.updateGameType.bind(this);
    }

/******************
 *
 * Setup Socket connection
 *
 *****************/

    componentDidMount() {
        const { socket } = this.props.route;

        socket.on('gametype:remove', this.removeGameType);
        socket.on('gametype:update', this.updateGameType);

        socket.emit('gametype:request', (response) => {
            const { gametypes } = response;

            this.setState({ gametypes });
        });

        socket.emit('gametype:scoring', (response) => {
            const { scoring } = response;

            this.setState({ scoring });
        });
    }

    removeGameType(response) {
        const { gametypes } = this.state;
        const { uid } = response;
        const newGameTypes = _.reject(gametypes, { uid });

        this.setState({ gametypes: newGameTypes });
    }

    updateGameType(gametype) {
        const { gametypes } = this.state;
        const oldGameType = _.find(gametypes, { uid: gametype.uid });

        if (oldGameType) {
            const index = gametypes.indexOf(oldGameType);
            gametypes.splice(index, 1, gametype);
        } else {
            gametypes.push(gametype);
        }

        this.setState({ gametypes });
    }

/******************
 *
 * Handelers
 *
 *****************/

    handleGameTypeChange(gametype) {
        const { socket } = this.props.route;

        socket.emit('gametype:update', gametype, (response) => {
            const { gametypes } = response;

            this.setState({
                gametypes,
                gametype: {},
            });
        });
    }

    handleGameTypeEdit(uid) {
        return () => {
            const { socket } = this.props.route;

            socket.emit('gametype:getById', { uid }, (response) => {
                const { gametype } = response;

                this.setState({ gametype });
            });
        };
    }

    handleGameTypeRemove(uid) {
        return () => {
            const { gametypes } = this.state;
            const { socket } = this.props.route;
            const newGameTypes = _.reject(gametypes, { uid });

            this.setState({ gametypes: newGameTypes });
            socket.emit('gametype:remove', { uid });
        };
    }

    render() {
        const { gametypes, gametype, scoring } = this.state;
        const listItems = gametypes.map((current) => {
            const { name, description, type, uid } = current;
            const score = _.find(scoring, { uid: type });
            return (
                <li key={ uid }>
                    { name } { description } { score && score.name }
                    <button type="button" onClick={ this.handleGameTypeEdit(uid) }>edit</button>
                    <button type="button" onClick={ this.handleGameTypeRemove(uid) }>-</button>
                </li>
            );
        });

        return (
            <div>
                <h1>Create Game Type</h1>
                <Link to="/">Home</Link>
                <GameTypeForm onGameTypeChange={ this.handleGameTypeChange } gametype={ gametype } scoring={ scoring } />
                <h3> Games Type </h3>
                <ul className={ styles.liststyle }>{ listItems }</ul>
            </div>
        );
    }
}

GameTypePage.propTypes = {
    route: PropTypes.object.isRequired,
};

export default GameTypePage;
