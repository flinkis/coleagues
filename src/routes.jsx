import React from 'react';
import { Route, IndexRoute } from 'react-router';
import io from 'socket.io-client';

import App from './container';
import HomePage from './pages/home/page';
import GamePage from './pages/game/page';
import ScorePage from './pages/score/page';
import LoginPage from './pages/login/page';

//Socket
const socket = io.connect();
const refresh = () =>  {
    socket.emit('refresh');
}

export default (
    <Route path="/" component={ App }>
        <IndexRoute component={ HomePage } socket={ socket } onEnter={ refresh }/>
        <Route path="create/game" component={ GamePage } socket={ socket } />
        <Route path="score/:uid" component={ ScorePage } socket={ socket } />
        <Route path="create/user" component={ LoginPage } socket={ socket } />
    </Route>
);