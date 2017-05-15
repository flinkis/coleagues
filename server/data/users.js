const _ = require('lodash');

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
        return user && user.password === this._hashEncode(password) ? user.uid : false;
    },

    getGuestUser() {
        const uid = this._getUniqueId();
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

    signup(user, newUser) {
        const { password } = newUser;
        newUser.password = this._hashEncode(password);

        this.usersFromDB.push(newUser);
        this.update(user, newUser);
    },

    remove(uid) {
        this.currentUsers = _.reject(this.currentUsers, { uid });
    },

/******************
 * Private
 *****************/

    _getUniqueId() {
        let uid;

        do {
            uid = Math.random().toString(16).slice(2);
        } while (_.some(this.usersFromDB, {uid}));

        return uid;
    },

    _hashEncode(word) {
        let hash = 0;
        if (word.length === 0) {
            return hash;
        }

        let index = 0, 
            chr;

        for (index; index < word.length; index++) {
            chr   = word.charCodeAt(index);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0;
        }

        return hash;
    }
};
