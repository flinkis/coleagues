const _ = require('lodash');
const Helper = require('../helpers/general');
const Games = require('./games');
const { robin } = require('../helpers/seeding');

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
            const { participants, gametype } = tournament;
            tournament.uid = Helper.getUniqueId(this.tournaments);
            this.tournaments.push(tournament);

            _.each(robin(participants), (rounds, index) => {
                _.each(rounds, (participants) => {
                    Games.update({
                        participants, 
                        gametype, 
                        tournament: tournament.uid, 
                        round: index,
                    });
                });
            });
        }
    },

    remove(uid) {
        this.tournaments = _.reject(this.tournaments, { uid });
    }
}
