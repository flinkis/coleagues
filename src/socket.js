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

        return this.name;
    },

    free(name) {
        _.pull(this.names, name);
    }
};

// export function for listening to the socket
module.exports = function (socket) {
    let name = UserNames.getGuestName();
    console.log(UserNames.get());

    socket.emit('init', {
        name,
        users: UserNames.get()
    });

    socket.broadcast.emit('user:join', { name });

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
