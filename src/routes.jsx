import React from 'react';
import { Route, IndexRoute } from 'react-router';
import io from 'socket.io-client';

import App from './container';
import Home from './pages/home/page';
import Game from './pages/game/page';
import Score from './pages/score/page';
import Signup from './pages/signup/page';
import TournamentCreate from './pages/tournamentCreate/page';
import TournamentList from './pages/tournamentListing/page';
import GameType from './pages/gametype/page';

// Socket
const socket = io.connect();

const refresh = () => {
    socket.emit('refresh');
};

export default (
    <Route path="/" component={ App }>
        <IndexRoute component={ Home } socket={ socket } onEnter={ refresh } />
        <Route path="user" component={ Signup } socket={ socket } />
        <Route path="game" component={ Game } socket={ socket } />
        <Route path="game/:uid" component={ Game } socket={ socket } />
        <Route path="score/:uid" component={ Score } socket={ socket } />
        <Route path="tournament" component={ TournamentCreate } socket={ socket } />
        <Route path="tournament/:uid" component={ TournamentList } socket={ socket } />
        <Route path="gametype" component={ GameType } socket={ socket } />
    </Route>
);
