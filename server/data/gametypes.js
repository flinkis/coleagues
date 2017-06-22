const _ = require('lodash');
const helper = require('../helper');

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
            gameType.uid = helper.getUniqueId(this.gameTypes);
            this.gameTypes.push(gameType);
        }
    },

    remove(uid) {
        this.gameTypes = _.reject(this.gameTypes, { uid });
    }
}
