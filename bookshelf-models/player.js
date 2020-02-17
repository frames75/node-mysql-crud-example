const bookshelf = require('../db-bookshelf');

const Player = bookshelf.Model.extend({
	tableName: 'players'
});

module.exports = Player;
