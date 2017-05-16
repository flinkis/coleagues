import React from 'react';
import { Route, IndexRoute } from 'react-router';
import io from 'socket.io-client';

import App from './container';
import HomePage from './pages/home/page';
import GamePage from './pages/game/page';
import ScorePage from './pages/score/page';
import SignupPage from './pages/signup/page';
import TournamentPage from './pages/tournament/page';
import GameTypePage from './pages/gametype/page';

// Socket
const socket = io.connect();

const refresh = () => {
    socket.emit('refresh');
};

export default (
    <Route path="/" component={ App }>
        <IndexRoute component={ HomePage } socket={ socket } onEnter={ refresh } />
        <Route path="user" component={ SignupPage } socket={ socket } />
        <Route path="game" component={ GamePage } socket={ socket } />
        <Route path="game/:uid" component={ GamePage } socket={ socket } />
        <Route path="tournament" component={ TournamentPage } socket={ socket } />
        <Route path="gametype" component={ GameTypePage } socket={ socket } />

        <Route path="score/:uid" component={ ScorePage } socket={ socket } />
    </Route>
);
