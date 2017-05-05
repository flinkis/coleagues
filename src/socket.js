// Keep track of which names are used so that there are no duplicates
const UserNames = {
    names: [],

    claim(name) {
        if (!name || this.names[name]) {
            return false;
        } else {
            this.names[name] = true;
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

    get() {
        let res = this.names.map(item => item);
        return res;
    },

    free(name) {
        if (this.names[name]) {
            delete this.names[name];
        }
    }
};

// export function for listening to the socket
module.exports = function (socket) {
    let name = UserNames.getGuestName();

    // send the new user their name and a list of users
    socket.emit('init', {
        name: name,
        users: UserNames.get()
    });

    // notify other clients that a new user has joined
    socket.broadcast.emit('user:join', {
        name: name
    });

    // broadcast a user's message to other users
    socket.on('send:message', function (data) {
        socket.broadcast.emit('send:message', {
            user: name,
            text: data.text
        });
    });

    // validate a user's name change, and broadcast it on success
    socket.on('change:name', function (data, fn) {
        if (UserNames.claim(data.name)) {
            let oldName = name;
            UserNames.free(oldName);
            name = data.name;
            
            socket.broadcast.emit('change:name', {
                oldName: oldName,
                newName: name
            });

            fn(true);
        } else {
            fn(false);
        }
    });

    // clean up when a user leaves, and broadcast it to other users
    socket.on('disconnect', function () {
        socket.broadcast.emit('user:left', {
            name: name
        });
        UserNames.free(name);
    });
};
