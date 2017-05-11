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

    getUniqueId() {
        let uid;

        do {
            uid = Math.random().toString(16).slice(2);
        } while (_.some(this.games, {uid}));

        return uid;
    },

    add(game) {
        if (_.includes(this.games, game)) {
            return false;
        } else {
            this.games.push(game);
            return true;
        }
    },

    update(data) {
        const { game, uid } = data;
        const oldGame = this.getById(uid);
        if ( oldGame ) {
            game.uid = uid;
            this.games.splice(
                this.games.indexOf(oldGame), 1, game
            );
            return true;
        } else {
            return false;
        }
    },

    remove(uid) {
        this.games = _.reject(this.games, { uid });
    }
}
