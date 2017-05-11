const _ = require('lodash');

const Users = require('./data/users');
const Games = require('./data/games');

// export function for listening to the socket
module.exports = (socket) => {
    let user = user ? user : Users.getGuestUser();

/******************
 *
 * Emit Init and send all data to clinent
 *
 *****************/

    socket.emit('init', {
        user: user,
        users: Users.getCurrent(),
        games: Games.getAll(),
    });

    socket.on('refresh', () => {
        socket.emit('init', {
            user: user,
            users: Users.getCurrent(),
            games: Games.getAll(),
        });
    });

/******************
 *
 * User calls
 *
 *****************/

    socket.on('user:getNewGuest', (callback) => {
        const newGuest = Users.getGuestUser();
        socket.broadcast.emit('user:update', { user, newGuest });
        user = newGuest;
        callback({ newGuest });
    });

    socket.broadcast.emit('user:join', { user });

    socket.on('user:update', (data) => {
        const { newUser } = data;
        newUser.uid = Users.getUniqueId();

        Users.update(user, newUser);

        socket.broadcast.emit('user:update', { user, newUser });
        user = newUser;
    });

    socket.on('user:hashPassword', (data, callback) => {
        const { password } = data;
        const hash = Users._hashEncode(password.toString());
        callback({ hash });
    });

    socket.on('user:checkPassword', (data, callback) => {
        const uid = Users.checkPassword(data);
        if (uid) {
            user = Users.getById(uid);
            callback({ loggedInUser: user});
        } else {
            callback(false);
        }
    });

    // Remove user from current users on disconect
    socket.on('disconnect', () => {
        const { uid } = user;
        Users.remove(uid);
        socket.broadcast.emit('user:left', { uid });
    });

/******************
 *
 * Game calls
 *
 *****************/

    socket.on('games:add', (data, callback) => {
        if (Games.add(data.game)) {
            socket.broadcast.emit('games:add', data);
            callback(true);
        } else {
            callback(false);
        }
    });

    socket.on('games:remove', (data) => {
        const { uid } = data;
        Games.remove(uid);
        socket.broadcast.emit('games:remove', { uid });
    });

    socket.on('games:getById', (data, callback) => {
        const { uid } = data;
        const game = Games.getById(uid);
        callback({ game });
    });

    socket.on('games:getUniqueId', (callback) => {
        const uid = Games.getUniqueId();
        callback({ uid });
    });

    socket.on('games:update', (data, callback) => {
        if (Games.update(data)) {
            socket.broadcast.emit('games:update', data);
            callback(true);
        } else {
            callback(false);
        }
    });

};
