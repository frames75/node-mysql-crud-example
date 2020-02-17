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

module.exports = require('bookshelf')(knex);
module.exports.knex = knex;
