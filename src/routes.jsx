import React from 'react';
import { Route, IndexRoute } from 'react-router';
import io from 'socket.io-client';

import App from './container';
import HomePage from './pages/home/page';
import GamePage from './pages/game/page';
import ScorePage from './pages/score/page';
import SignupPage from './pages/signup/page';

import Auth from './auth';

//Socket
const socket = io.connect();

const refresh = () =>  {
    socket.emit('refresh');
}

let user;

const setUser = (newUser) => {
    user = newUser;
}

const getUser = () => {
    return user;
}

export default (
    <Route path="/" component={ App }>
        <IndexRoute component={ HomePage } socket={ socket } onEnter={ refresh } getUser={ getUser } setUser={ setUser }/>
        <Route path="create/user" component={ SignupPage } socket={ socket } getUser={ getUser } setUser={ setUser }/>
        <Route path="create/game" component={ GamePage } socket={ socket } getUser={ getUser } />
        <Route path="score/:uid" component={ ScorePage } socket={ socket } getUser={ getUser } />
    </Route>
);