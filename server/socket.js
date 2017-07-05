const _ = require('lodash');
const jwt = require('json-web-token');

const Users = require('./data/users');
const Games = require('./data/games');
const GameTypes = require('./data/gametypes');
const Tournaments = require('./data/tournaments');

const Helper = require('./helpers/general');

// export function for listening to the socket
module.exports = (socket) => {
    const secret = 'TOPSECRETTTTT';
    let currentUser = Users.getGuestUser();

/******************
 *
 * Emit Init and send ALL data to client
 *
 *****************/

    socket.broadcast.emit('user:update', {
        user: null, 
        newUser: currentUser
    });

    socket.on('refresh', () => {
        socket.emit('init', {
            user: currentUser,
            users: Users.getCurrent(),
            games: Games.getAll(),
            tournaments: Tournaments.getAll(),
        })
    });

    socket.on('authenticate', (data) => {
        const { token } = data;
        const unauthorized = (msg) => {
            socket.emit('unauthorized', msg);
        };

        if(typeof token !== "string") {
            return unauthorized({ type: 'invalid_token', description: 'invalid token data type' });
        }

        jwt.decode(secret, token, (err, decodedPayload) => {
            if (err) {
              return unauthorized({ type: 'invalid_token', description: err.message });
            }

            socket.emit('authenticated');
        });
    });

    socket.on('disconnect', () => {
        if (!!currentUser) {
            const { uid } = currentUser;

            Users.remove(uid);
            socket.broadcast.emit('user:left', { uid });
        }
    });

/******************
 *
 * User
 *
 *****************/

    socket.on('user:getNewGuest', (callback) => {
        const newUser = Users.getGuestUser();

        socket.broadcast.emit('user:update', { user: currentUser, newUser });
        currentUser = newUser;

        Helper.testAndDoCallback(callback, { newUser }, 'user:getNewGuest');
    });

    socket.on('user:update', (data) => {
        const { user, newUser } = data;

        if (!!newUser) {
            const oldUser = user || currentUser;
            Users.update(oldUser, newUser);
            const { name, uid } = newUser;

            socket.broadcast.emit('user:update', { 
                user: oldUser, 
                newUser: { name, uid }
            });

            currentUser = { name, uid };
        } else {
            socket.emit('message', { type: 'missing_variable', description: '"newUser" not found in payload, [user:update]' });
        }
    });

    socket.on('user:signup', (data, callback) => {
        if (!!data) {
            const { name } = data;

            if (Users.checkUsername(data)) {
                Users.signup(currentUser, data, (uid) => {
                    socket.broadcast.emit('user:update', { user: currentUser, newUser: { name, uid }});
                    currentUser = { name, uid };

                    Helper.testAndDoCallback(callback, { name, uid }, 'user:signup');
                });
            } else {
                Helper.testAndDoCallback(callback, false, 'user:signup');
            }

        } else {
            socket.emit('message', { type: 'missing_variable', description: 'payload missing, [user:signup]' });
        }
    });

    socket.on('user:trylogin', (data, callback) => {
        const uid = Users.checkPassword(data);
        const isUserLogedin = Users.isUserLogedin(data);
        if (uid && isUserLogedin) {
            const loggedInUser = Users.getById(uid);

            Helper.testAndDoCallback(callback, { loggedInUser }, 'user:checkPassword');
        } else {
            Helper.testAndDoCallback(callback, false, 'user:checkPassword');
        }
    });

    socket.on('user:request', (callback) => {
        const users = Users.getAll();

        Helper.testAndDoCallback(callback, { users }, 'user:request');
    });

    socket.on('user:logout', (data) => {
        const { uid } = data;

        Users.remove(uid);
        socket.broadcast.emit('user:left', { uid });
    });

/******************
 *
 * Game
 *
 *****************/

    socket.on('game:remove', (data) => {
        const { uid } = data;
        if (!!uid) {
            Games.remove(uid);
            socket.broadcast.emit('game:remove', { uid });
        } else {
            socket.emit('message', { type: 'missing_variable', description: '"uid" not found in payload, [game:remove]' });
        }
    });

    socket.on('game:getById', (data, callback) => {
        const { uid } = data;

        if (!!uid) {
            const game = Games.getById(uid);

            Helper.testAndDoCallback(callback, { game }, 'game:getById');
        } else {
            socket.emit('message', { type: 'missing_variable', description: '"uid" not found in payload, [game:getById]' });
        }
    });

    socket.on('game:request', (callback) => {
        const games = Games.getAll();

        Helper.testAndDoCallback(callback, { games }, 'game:request');
    });

    socket.on('game:update', (data, callback) => {
        Games.update(data)
        socket.broadcast.emit('game:update', data);

        Helper.testAndDoCallback(callback, true, 'game:update');
    });

/******************
 *
 * GameType
 *
 *****************/

    socket.on('gametype:update', (data, callback) => {
        GameTypes.update(data);
        socket.broadcast.emit('gametype:update', data);

        const gametypes = GameTypes.getAll();

        Helper.testAndDoCallback(callback, { gametypes }, 'gametype:update');
    });

    socket.on('gametype:remove', (data) => {
        const { uid } = data;
        if (!!uid) {
            GameTypes.remove(uid);
            socket.broadcast.emit('gametype:remove', { uid });
        } else {
            socket.emit('message', { type: 'missing_variable', description: '"uid" not found in payload, [games:remove]' });
        }
    });

    socket.on('gametype:request', (callback) => {
        const gametypes = GameTypes.getAll();

        Helper.testAndDoCallback(callback, { gametypes }, 'gametype:request');
    });

    socket.on('gametype:getById', (data, callback) => {
        const { uid } = data;

        if (!!uid) {
            const gametype = GameTypes.getById(uid);

            Helper.testAndDoCallback(callback, { gametype }, 'gametype:getById');
        } else {
            socket.emit('message', { type: 'missing_variable', description: '"uid" not found in payload, [gametype:getById]' });
        }
    });

    socket.on('gametype:scoring', (callback) => {
        const scoring = GameTypes.getScoring();

        Helper.testAndDoCallback(callback, { scoring }, 'gametype:request');
    });

/******************
 *
 * Tournament
 *
 *****************/

    socket.on('tournament:update', (data, callback) => {
        Tournaments.update(data);
        socket.broadcast.emit('tournament:update', data);

        const tournaments = Tournaments.getAll();

        Helper.testAndDoCallback(callback, { tournaments }, 'tournament:update');
    });

    socket.on('tournament:remove', (data) => {
        const { uid } = data;
        if (!!uid) {
            Tournaments.remove(uid);
            socket.broadcast.emit('tournament:remove', { uid });
        } else {
            socket.emit('message', { type: 'missing_variable', description: '"uid" not found in payload, [tournament:remove]' });
        }
    });

    socket.on('tournament:request', (callback) => {
        const tournaments = Tournaments.getAll();

        Helper.testAndDoCallback(callback, { tournaments }, 'tournament:request');
    });

    socket.on('tournament:getById', (data, callback) => {
        const { uid } = data;

        if (!!uid) {
            const tournament = Tournaments.getById(uid);

            Helper.testAndDoCallback(callback, { tournament }, 'tournament:getById');
        } else {
            socket.emit('message', { type: 'missing_variable', description: '"uid" not found in payload, [tournament:getById]' });
        }
    });

    socket.on('tournament:start', (data, callback) => {
        const { tournament, type } = data;
    
        if (!!tournament && !!type) {
            const paring = Tournaments.getParings(type, tournament);

            Games.bulkUpdate(paring, { tournament: tournament.uid, gametype: tournament.game_type }, (games) => {
                if(games) {
                    Tournaments.update(tournament);
                    socket.broadcast.emit('tournament:update', tournament);
                    Helper.testAndDoCallback(callback, { games }, 'tournament:getById');
                }
            });
        }
    });
};
