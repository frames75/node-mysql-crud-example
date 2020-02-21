const Player = require('../../bookshelf-models/player');
const fs = require('fs');
const root_dir = '/players';

module.exports = {
    addPlayerPage: (req, res) => {
        res.render('add-player.ejs', {
            title: 'Welcome to Socka | Add a new player'
            ,message: ''
        });
    },

    addPlayer: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';

        let username = req.body.username
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let new_player_data = {'first_name': req.body.first_name,
                            'last_name': req.body.last_name,
                            'position': req.body.position,
                            'number': req.body.number,
                            'image': image_name,
                            'user_name': username};

        // check the filetype before uploading it
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
            // upload the file to the /public/assets/img directory
            uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                if (err) {
                    return res.status(500).send(err);
                }

                // send the player's details to the database
                Player.create(new_player_data)
                .then((player) => { res.redirect(root_dir + '/'); })
                .catch((err) => {
                    // use err.player to call add-player template.
                    if (err.code === "DB_MODEL_ERROR") {
                        res.render('add-player-error-exists.ejs', {
                            message: err.message,
                            player: err.player,
                            title: 'Welcome to Socka | Add a new player'
                        });
                    } 
                    else {
                        res.status(500).send(err);
                    } 
                });
            });
        } else {
            message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
            res.render('add-player.ejs', {
                message,
                title: 'Welcome to Socka | Add a new player'
            });
        }            
    },

    editPlayerPage: (req, res) => {
        let playerId = req.params.id;

        Player.findOne({'id': playerId}, {require: true})
//        Player.where({'id': playerId}).fetch()
        .then((player) => {
            res.render('edit-player.ejs', {
                title: 'Edit  Player'
                ,player: player.toJSON()
                ,message: ''
            });
        }).catch((err) => { res.status(500).send(err); });
    },

    editPlayer: (req, res) => {
        let playerId = req.params.id;
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;

        Player.update({first_name: first_name,
                last_name: last_name,
                position: position,
                number: number}, 
                {id: playerId})
        .then((player) => { res.redirect(root_dir + '/'); })
        .catch((err) => {
            if (err.code === "DB_MODEL_ERROR") {
                res.render('edit-player.ejs', {
                    message: err.message,
                    player: err.player,
                    title: 'Welcome to Socka | Edit new player'
                });
            } 
            else {
                res.status(500).send(err);
            } 
        });
    },

    deletePlayer: (req, res) => {
        let playerId = req.params.id;

        Player.destroy({'id': playerId})
//        Player.forge({id: playerId}).destroy()
        .then((player) => { res.redirect(root_dir + '/'); })
        .catch((err) => { res.status(500).send(err); });
    }
};

