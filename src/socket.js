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
        return this.names;
    },

    free(name) {
        if (this.names[name]) {
            delete this.names[name];
        }
    }
};

// export function for listening to the socket
module.exports = function (socket) {
    socket.emit('init', {
        name: UserNames.getGuestName(),
        users: UserNames.get()
    });

    socket.broadcast.emit('user:join', {
        name: name
    });

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

    socket.on('disconnect', function (data) {
        socket.broadcast.emit('user:left', {
            name: data.name
        });
        UserNames.free(data.name);
    });
};
