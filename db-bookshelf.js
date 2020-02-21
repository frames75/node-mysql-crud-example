const db_config = {
	client: 'mysql',
	connection: {
		host: 'localhost',
		user: 'romario',
		password: 'dasouza',
		database: 'socka',
		charset: 'utf8mb4_general_ci'
	}
};

const knex = require('knex')(db_config);

var bookshelf = require('bookshelf')(knex);
/**** This lines don't work right. It's necessary to use 'pluggable'.
const bookshelf_modelbase = require('bookshelf-modelbase')(bookshelf);
const Player = bookshelf_modelbase.extend({
	tableName: 'players'
})
*/
bookshelf.plugin(require('bookshelf-modelbase').pluggable);

module.exports = bookshelf;
module.exports.knex = knex;
