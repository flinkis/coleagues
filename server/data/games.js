const _ = require('lodash');
const helper = require('../helper');

/******************
 *
 * Games object
 *
 *****************/

module.exports = {
    games: [],

    getAll() {
        return this.games;
    },

    getById(uid) {
        return _.find(this.games, { uid });
    },

    update(data) {
        const { game } = data;

        if (!_.isUndefined(game.uid) && _.some(this.games, { uid: game.uid })) {
            const oldGame = this.getById(game.uid );
            const index = this.games.indexOf(oldGame);

            this.games.splice(index, 1, game);
        } else {
            game.uid = helper.getUniqueId(this.games);
            this.games.push(game);
        }
    },

    remove(uid) {
        this.games = _.reject(this.games, { uid });
    }
}
