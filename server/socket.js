const _ = require('lodash');
const jwt = require('json-web-token');

const Users = require('./data/users');
const Games = require('./data/games');

// export function for listening to the socket
module.exports = (socket) => {
    let currentUser = Users.getGuestUser();

    const secret = 'TOPSECRETTTTT';

/******************
 *
 * Emit Init and send all data to clinent
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
            games: Games.getAll()
        })
    });

    socket.on('authenticate', (data) => {
        const { token } = data;
        const unauthorized = (msg) => {
            socket.emit('unauthorized', msg);
        };

        if(typeof token !== "string") {
            return unauthorized({ type: 'invalid_token', description: 'invalid token datatype' });
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
 * User calls
 *
 *****************/

    socket.on('user:getNewGuest', (callback) => {
        const newUser = Users.getGuestUser();

        socket.broadcast.emit('user:update', { user: currentUser, newUser });
        currentUser = newUser;

        testAndDoCallback(callback, { newUser }, 'user:getNewGuest');
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
            const { uid } = currentUser;

            Users.signup(currentUser, { ...data, uid });

            socket.broadcast.emit('user:update', { user: currentUser, newUser: { name, uid }});
            currentUser = { name, uid };

            testAndDoCallback(callback, { name, uid }, 'user:signup');
        } else {
            socket.emit('message', { type: 'missing_variable', description: 'payload missing, [user:signup]' });
        }
    });

    socket.on('user:checkPassword', (data, callback) => {
        const uid = Users.checkPassword(data);
        if (uid) {
            const loggedInUser = Users.getById(uid);

            testAndDoCallback(callback, { loggedInUser }, 'user:checkPassword');
        } else {
            testAndDoCallback(callback, false, 'user:checkPassword');
        }
    });

    socket.on('user:logout', (data) => {
        const { uid } = data;

        Users.remove(uid);
        socket.broadcast.emit('user:left', { uid });
    });

/******************
 *
 * Game calls
 *
 *****************/

    socket.on('games:add', (data, callback) => {
        const { game } = data;

        if (Games.add(game)) {
            socket.broadcast.emit('games:add', data);

            testAndDoCallback(callback, true, 'games:add');
        } else {
            testAndDoCallback(callback, false, 'games:add');
        }
    });

    socket.on('games:remove', (data) => {
        const { uid } = data;
        if (!!uid) {
            Games.remove(uid);
            socket.broadcast.emit('games:remove', { uid });
        } else {
            socket.emit('message', { type: 'missing_variable', description: '"uid" not found in payload, [games:remove]' });
        }
        
    });

    socket.on('games:getById', (data, callback) => {
        const { uid } = data;

        if (!!uid) {
            const game = Games.getById(uid);

            testAndDoCallback(callback, { game }, 'games:getById');
        } else {
            socket.emit('message', { type: 'missing_variable', description: '"uid" not found in payload, [games:getById]' });
        }
    });

    socket.on('games:getUniqueId', (callback) => {
        const uid = Games.getUniqueId();

        testAndDoCallback(callback, { uid }, 'games:getUniqueId');
    });

    socket.on('games:update', (data, callback) => {
        if (Games.update(data)) {
            socket.broadcast.emit('games:update', data);

            testAndDoCallback(callback, true, 'games:update');
        } else {
            testAndDoCallback(callback, false, 'games:update');
        }
    });

/******************
 *
 * Hellper
 *
 *****************/
    const testAndDoCallback = (callback, payload, caller) => {
        if (_.isFunction(callback)) {
            callback(payload);
        } else {
            socket.emit('message', { type: 'missing_callback', description: 'callback missing from [' + caller + ']' });
            return;
        }
    }
};
