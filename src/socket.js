// Keep track of which names are used so that there are no duplicates
const UserNames = () => {
    let names = {};

    let claim = function (name) {
        if (!name || names[name]) {
            return false;
        } else {
            names[name] = true;
            return true;
        }
    };

    // find the lowest unused "guest" name and claim it
    const getGuestName = function () {
        let name,
        nextUserId = 1;

        do {
            name = 'Guest ' + nextUserId;
            nextUserId += 1;
        } while (!claim(name));

        return name;
    };

    // serialize claimed names as an array
    const get = function () {
        let res = [];
        for (user in names) {
            res.push(user);
        }

        return res;
    };

    const free = function (name) {
        if (names[name]) {
            delete names[name];
        }
    };

    return {
        claim: claim,
        free: free,
        get: get,
        getGuestName: getGuestName
    };
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
