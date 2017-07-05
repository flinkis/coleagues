const _ = require('lodash');
const Helper = require('../helpers/general');

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

    update(game) {
        if (!_.isUndefined(game.uid) && _.some(this.games, { uid: game.uid })) {
            const oldGame = this.getById(game.uid );
            const index = this.games.indexOf(oldGame);

            this.games.splice(index, 1, game);
        } else {
            game.uid = Helper.getUniqueId(this.games);
            this.games.push(game);
        }
    },

    remove(uid) {
        this.games = _.reject(this.games, { uid });
    },

    bulkUpdate(pairing, extention = {}, callback) {
        _.each(pairing, (rounds, index) => {
            _.each(rounds, (participants) => {
                let game = _.assign({
                    participants,
                    round: index,
                }, extention);
                this.update(game);
            });
        });

        if(_.isFunction(callback)) {
            callback(this.games);
        }
    }
}
