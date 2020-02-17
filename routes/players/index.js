const Player = require('../../bookshelf-models/player');
const root_dir = '/players';

module.exports = {
    getHomePage: (req, res) => {
        Player.fetchAll()
        .then( (result) => { 
            res.render('index.ejs', {
                title: 'Welcome to Socka | View Players'
                ,players: result.toJSON() });
        }).catch( (err) => { 
            res.redirect(root_dir + '/');
            console.log(err); 
        });
    }
};

/*const root_dir = '/players';

module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `players` ORDER BY id ASC"; // query database to get all the players

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect(root_dir + '/');
            }
            res.render('index.ejs', {
                title: 'Welcome to Socka | View Players'
                ,players: result
            });
        });
    },
};

*/