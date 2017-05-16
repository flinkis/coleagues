const _ = require('lodash');

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
            game.uid = this._getUniqueId();
            this.games.push(game);
        }
    },

    remove(uid) {
        this.games = _.reject(this.games, { uid });
    },

    _getUniqueId() {
        let uid;

        do {
            uid = Math.random().toString(16).slice(2);
        } while (_.some(this.games, {uid}));

        return uid;
    },
}
