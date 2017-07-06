import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import GameTypeForm from '../../components/forms/gametype/component';
import GameTypeList from '../../components/list/gametype/component';

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
        const { socket } = this.props;

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
        const { socket } = this.props;

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
            const { socket } = this.props;

            socket.emit('gametype:getById', { uid }, (response) => {
                const { gametype } = response;

                this.setState({ gametype });
            });
        };
    }

    handleGameTypeRemove(uid) {
        return () => {
            const { gametypes } = this.state;
            const { socket } = this.props;
            const newGameTypes = _.reject(gametypes, { uid });

            this.setState({ gametypes: newGameTypes });
            socket.emit('gametype:remove', { uid });
        };
    }

    render() {
        const { gametypes, gametype, scoring } = this.state;

        return (
            <div className="hg__main">
                <GameTypeForm onGameTypeChange={ this.handleGameTypeChange } gametype={ gametype } scoring={ scoring } />
                <GameTypeList gametypes={ gametypes } scoring={ scoring } onEdit={ this.handleGameTypeEdit } onRemove={ this.handleGameTypeRemove } />
            </div>
        );
    }
}

GameTypePage.propTypes = {
    socket: PropTypes.object.isRequired,
};

export default GameTypePage;
