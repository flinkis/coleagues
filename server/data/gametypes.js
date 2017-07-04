const _ = require('lodash');
const Helper = require('../helpers/general');

/******************
 *
 * GameTypes object
 *
 *****************/

module.exports = {
    gameTypes: [],
    scoring: [{
        name: 'Highest Score Wins',
        uid: '0',
        formula: '>'
    },{
        name: 'Lowest Score Wins',
        uid: '1',
        formula: '<'
    },{
        name: 'No points awarded',
        uid: '2',
        formula: ''
    }],

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
            gameType.uid = Helper.getUniqueId(this.gameTypes);
            this.gameTypes.push(gameType);
        }
    },

    remove(uid) {
        this.gameTypes = _.reject(this.gameTypes, { uid });
    },

    getScoring() {
        return this.scoring;
    }
}
