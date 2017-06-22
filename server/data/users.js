const _ = require('lodash');
const helper = require('../helper');

/******************
 *
 * User object
 *
 *****************/

module.exports = {
    currentUsers: [],
    usersFromDB: [],

    getCurrent() {
        return this.currentUsers;
    },

    getById(uid) {
        return _.find(this.usersFromDB, { uid });
    },

    checkPassword(data) {
        const { name, password } = data;
        const user = _.find(this.usersFromDB, { name });

        return user && user.password === thelper.hashEncode(password) ? user.uid : false;
    },

    isUserLogedin(data) {
        const { name } = data;
        const inCurrentUser = _.find(this.currentUsers, { name });

        return _.isUndefined(inCurrentUser);
    },

    checkUsername(data) {
        const { name } = data;
        const userinDB = _.find(this.usersFromDB, { name });

        return _.isUndefined(userinDB);
    },

    getGuestUser() {
        const uid = helper.getUniqueId(this.usersFromDB);
        let name,
            nextUserId = 1;

        do {
            name = 'Guest ' + nextUserId;
            nextUserId += 1;
        } while (_.some(this.currentUsers, {name}));

        this.currentUsers.push({ name, uid })
        return { name, uid };
    },

    update(user, newUser) {
        const { name, uid } = newUser;

        if(user) {
            this.remove(user.uid);
        }

        this.currentUsers.push({ name, uid });
    },

    signup(user, newUser, callback) {
        const { password } = newUser;
        newUser.password = helper.hashEncode(password);
        newUser.uid = helper.getUniqueId(this.userinDB);

        this.usersFromDB.push(newUser);
        this.update(user, newUser);

        callback(newUser.uid);
    },

    remove(uid) {
        this.currentUsers = _.reject(this.currentUsers, { uid });
    }
};
