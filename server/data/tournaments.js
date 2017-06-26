const _ = require('lodash');
const helper = require('../helper');

/******************
 *
 * Tournament object
 *
 *****************/

module.exports = {
    tournaments: [],

    getAll() {
        return this.tournaments;
    },

    getById(uid) {
        return _.find(this.tournaments, { uid });
    },

    update(tournament) {
        if (_.some(this.tournaments, { uid: tournament.uid })) {
            const oldTournament = this.getById(tournament.uid );
            const index = this.tournaments.indexOf(oldTournament);

            this.tournaments.splice(index, 1, tournament);
        } else {
            tournament.uid = helper.getUniqueId(this.tournaments);
            this.tournaments.push(tournament);
        }
    },

    remove(uid) {
        this.tournaments = _.reject(this.tournaments, { uid });
    }
}
