const bookshelf = require('../db-bookshelf');

const Player = bookshelf.Model.extend({
	tableName: 'players',

	initialize() {
		// Avoid create user with 'user_name' existent.
		this.on('creating', (model) => {
			// It's mandatory '{require: false}' for the 'if (player !== null)'
			return Player.findOne({'user_name': model.get('user_name')}, {require: false})
				.then( (player) => {
					if (player !== null) {
						const message = 'Username already exists (' + player.get('user_name') + '!!)';
						let error = new PlayerError(message, this.toJSON());
						error.code = "DB_MODEL_ERROR";
  						throw error;
					}
				});
		}),

		// Avoid update or create user with 'first_name'+'last_name' existent.
		this.on('saving', (model) => {
			return Player.query(function(qb) {
				qb.where('user_name','<>', model.get('user_name'))
					.andWhere('first_name', model.get('first_name'))
					.andWhere('last_name', model.get('last_name')); })
				.fetch({require:false})
				.then( (player) => {
					if (player !== null) {
						const message = 'Firs&Last name already exists' ;
						let error = new PlayerError(message, this.toJSON());
						error.code = "DB_MODEL_ERROR";
  						throw error;
					}
				});
		})
	}
});

// Custom Error class to be able to send player object to
// the players controllers.
class PlayerError extends Error {
	constructor(message, player) {
		super(message);
		Error.captureStackTrace(this, PlayerError)
		this.player = player;
	}
}

module.exports = Player;
