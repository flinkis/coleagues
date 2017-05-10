const _ = require('lodash');

const Users = {
    currentUsers: [],
    users: [],

    getCurrent() {
        return this.currentUsers;
    },

    getById(uid) {
        return _.find(this.users, { uid });
    },

    getUniqueId() {
        let uid;

        do {
            uid = Math.random().toString(16).slice(2);
        } while (_.some(this.users, {uid}));

        return uid;
    },

    add(user) {
        const { uid, password } = user;
        if (this.getById(uid)) {
            return false;
        } else {
            user.password = hashCode(password);
            this.users.push(user);
            return true;
        }
    },

    checkPassword(data) {
        const { name, password } = data;
        const user = _.find(this.users, { name });
        return user && user.password === this.hashCode(password) ? user.uid : false;
    },

    hashCode(word) {
        var hash = 0, 
        i, 
        chr;

        if (word.length === 0) {
            return hash;
        }

        for (i = 0; i < word.length; i++) {
            chr   = word.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0;
        }

        return hash;
    },

    getGuestUser() {
        const uid = this.getUniqueId();
        let name,
            nextUserId = 1;

        do {
            name = 'Guest ' + nextUserId;
            nextUserId += 1;
        } while (_.some(this.currentUsers, {name}));

        this.currentUsers.push({ name, uid })
        return { name, uid };
    },

    update(oldUser, newUser) {
        const getIndex = (haystack, needle) => Math.max(_.indexOf(haystack, needle),  0);
        const currentIndex = getIndex(this.currentUsers, oldUser);
        const userIndex = getIndex(this.users, oldUser);

        this.currentUsers.splice(currentIndex, 1, newUser);
        this.users.splice(userIndex, 1, newUser);
    },

    remove(uid) {
        this.currentUsers = _.reject(this.currentUsers, { uid });
    }
};

const Games = {
    games: [],

    getAll() {
        return this.games;
    },

    getById(uid) {
        return _.find(this.games, { uid });
    },

    getUniqueId() {
        let uid;

        do {
            uid = Math.random().toString(16).slice(2);
        } while (_.some(this.games, {uid}));

        return uid;
    },

    add(game) {
        if (_.includes(this.games, game)) {
            return false;
        } else {
            this.games.push(game);
            return true;
        }
    },

    update(data) {
        const { game, uid } = data;
        const oldGame = this.getById(uid);
        if ( oldGame ) {
            game.uid = uid;
            this.games.splice(
                this.games.indexOf(oldGame), 1, game
            );
            return true;
        } else {
            return false;
        }
    },

    remove(uid) {
        this.games = _.reject(this.games, { uid });
    }
}

// export function for listening to the socket
module.exports = function (socket) {
    let user = Users.getGuestUser();

    socket.emit('init', {
        user: user,
        users: Users.getCurrent(),
        games: Games.getAll(),
    });

    socket.on('refresh', function() {
        socket.emit('init', {
            user: user,
            users: Users.getCurrent(),
            games: Games.getAll(),
        });
    });

    socket.on('user:getNewGuest', function(callback) {
        const newGuest = Users.getGuestUser();
        socket.broadcast.emit('user:update', { user, newGuest });
        user = newGuest;
        callback({ newGuest });
    });

    socket.broadcast.emit('user:join', { user });

    socket.on('user:update', function (data) {
        const { newUser } = data;
        console.log(newUser, user);
        newUser.uid = user.uid;

        Users.update(user, newUser);

        socket.broadcast.emit('user:update', { user, newUser });
        user = newUser;
    });

    socket.on('user:hashPassword', function(data, callback) {
        const { password } = data;
        const hash = Users.hashCode(password.toString());
        callback({ hash });
    });

    socket.on('user:checkPassword', function (data, callback) {
        const uid = Users.checkPassword(data);
        if (uid) {
            user = Users.getById(uid);
            callback({ loggedInUser: user});
        } else {
            callback(false);
        }
    });

    socket.on('games:add', function (data, callback) {
        if (Games.add(data.game)) {
            socket.broadcast.emit('games:add', data);
            callback(true);
        } else {
            callback(false);
        }
    });

    socket.on('games:remove', function (data) {
        const { uid } = data;
        Games.remove(uid);
        socket.broadcast.emit('games:remove', { uid });
    });

    socket.on('games:getById', function (data, callback) {
        const { uid } = data;
        const game = Games.getById(uid);
        callback({ game });
    });

    socket.on('games:getUniqueId', function (callback) {
        const uid = Games.getUniqueId();
        callback({ uid });
    });

    socket.on('games:update', function (data, callback) {
        if (Games.update(data)) {
            socket.broadcast.emit('games:update', data);
            callback(true);
        } else {
            callback(false);
        }
    });

    socket.on('disconnect', function () {
        const { uid } = user;
        Users.remove(uid);
        socket.broadcast.emit('user:left', { uid });
    });
};
