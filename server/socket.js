const _ = require('lodash');

const UserNames = {
    names: [],

    get() {
        return this.names;
    },

    claim(name) {
        if (_.includes(this.names, name)) {
            return false;
        } else {
            this.names.push(name);
            return true;
        }
    },

    getGuestName() {
        let name,
            nextUserId = 1;

        do {
            name = 'Guest ' + nextUserId;
            nextUserId += 1;
        } while (!this.claim(name));

        return name;
    },

    free(name) {
        _.pull(this.names, name);
    }
};

const Matches = {
    matches: [],

    get() {
        return this.matches;
    },

    add(match) {
        if (_.includes(this.matches, match)) {
            return false;
        } else {
            this.matches.push(match);
            return true;
        }
    },

    remove(match) {
        _.pull(this.matches, match);
    }
}

// export function for listening to the socket
module.exports = function (socket) {
    let name = UserNames.getGuestName();

    socket.emit('init', {
        name: name,
        users: UserNames.get(),
        matches: Matches.get(),
    });

    socket.on('refresh', function() {
        socket.emit('init', {
            name: name,
            users: UserNames.get(),
            matches: Matches.get(),
        });
    })

    socket.broadcast.emit('user:join', { name });

    socket.on('change:name', function (data, fn) {
        if (UserNames.claim(data.newName)) {
            UserNames.free(name);
            name = data.newName;
            socket.broadcast.emit('change:name', data);

            fn(true);
        } else {
            fn(false);
        }
    });

    socket.on('matches:add', function (data, fn) {
        if (Matches.add(data.match)) {
            socket.broadcast.emit('matches:add', data);
            fn(true);
        } else {
            fn(false);
        }
    });

    socket.on('matches:remove', function (data) {
        Matches.remove(data.match);
        socket.broadcast.emit('matches:add', data);
    });

    socket.on('disconnect', function () {
        UserNames.free(name);
        socket.broadcast.emit('user:left', {
            name
        });
    });
};
