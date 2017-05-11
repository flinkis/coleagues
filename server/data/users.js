const _ = require('lodash');

/******************
 *
 * User object
 *
 *****************/

module.exports = {
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
            user.password = _hashEncode(password);
            this.users.push(user);
            return true;
        }
    },

    checkPassword(data) {
        const { name, password } = data;
        const user = _.find(this.users, { name });
        return user && user.password === this._hashEncode(password) ? user.uid : false;
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
    },

/******************
 * Private
 *****************/

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
