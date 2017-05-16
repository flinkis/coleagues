const _ = require('lodash');

/******************
 *
 * GameTypes object
 *
 *****************/

module.exports = {
    gameTypes: [],

    getAll() {
        return this.gameTypes;
    },

    getById(uid) {
        return _.find(this.gameTypes, { uid });
    },

    update(gameType) {
        if (_.some(this.gameTypes, { uid: gameType.uid })) {
            const oldGameType = this.getById(gameType.uid );
            const index = this.gameTypes.indexOf(oldGameType);
            this.gameTypes.splice(index, 1, gameType);
        } else {
            gameType.uid = this._getUniqueId();
            this.gameTypes.push(gameType);
        }
    },

    remove(uid) {
        this.gameTypes = _.reject(this.gameTypes, { uid });
    },

/******************
 * Private
 *****************/

    _getUniqueId() {
        let uid;

        do {
            uid = Math.random().toString(16).slice(2);
        } while (_.some(this.gameTypes, {uid}));

        return uid;
    }
}
