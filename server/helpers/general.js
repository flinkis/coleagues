const _ = require('lodash');

/******************
 *
 * Helper
 *
 *****************/

module.exports = {
    getUniqueId(list) {
        let uid;

        do {
            uid = Math.random().toString(16).slice(2);
        } while (_.some(list, {uid}));

        return uid;
    },

    hashEncode(word) {
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
}