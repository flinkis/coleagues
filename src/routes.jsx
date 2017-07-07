import React from 'react';

import Home from './pages/home/page';
import Game from './pages/game/page';
import Score from './pages/score/page';
import Signup from './pages/signup/page';
import TournamentCreate from './pages/tournamentCreate/page';
import TournamentList from './pages/tournamentListing/page';
import GameType from './pages/gametype/page';

const routes = p => ([
    { path: '/',
        exact: true,
        id: 0,
        header: () => <h1>Colleagues</h1>,
        main: props => <Home socket={ p.socket } { ...props } />,
    },
    { path: '/signup',
        exact: true,
        id: 1,
        header: () => <h1>Signup</h1>,
        main: props => <Signup socket={ p.socket } { ...props } />,
    },
    { path: '/gametype',
        exact: true,
        id: 2,
        header: () => <h1>Game type</h1>,
        main: props => <GameType socket={ p.socket } { ...props } />,
    },
    { path: '/game',
        exact: true,
        id: 3,
        header: () => <h1>Game</h1>,
        main: props => <Game socket={ p.socket } { ...props } />,
    },
    { path: '/game/:uid',
        exact: true,
        id: 4,
        header: () => <h1>Edit game</h1>,
        main: props => <Game socket={ p.socket } { ...props } />,
    },
    { path: '/game/s/:uid',
        exact: true,
        id: 5,
        header: () => <h1>Report score</h1>,
        main: props => <Score socket={ p.socket } { ...props } />,
    },
    { path: '/tournament',
        exact: true,
        id: 6,
        header: () => <h1>Create tournament</h1>,
        main: props => <TournamentCreate socket={ p.socket } { ...props } />,
    },
    { path: '/tournament/:uid',
        exact: true,
        id: 7,
        header: () => <h1>Listting</h1>,
        main: props => <TournamentList socket={ p.socket } { ...props } />,
    },
]);

export default routes;
