const _ = require('lodash');
const Helper = require('../helpers/general');
const { fair, robin } = require('../helpers/seeding');


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
        }
    },

    remove(uid) {
        this.tournaments = _.reject(this.tournaments, { uid });
    },

    getParing(type, tournament) {
        const { participants } = tournament;

        switch(type) {
            case "robin":
                return robin(participants);
            case "fair":
                return fair(participants);
        }
    }
}
