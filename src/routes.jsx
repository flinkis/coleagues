import React from 'react';
import { Route, IndexRoute } from 'react-router';
import io from 'socket.io-client';

import App from './container';
import HomePage from './pages/home/page';
import GamePage from './pages/game/page';

//Socket
const socket = io.connect();

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage} socket={socket} />
        <Route path="match" component={GamePage} socket={socket} />
    </Route>
);