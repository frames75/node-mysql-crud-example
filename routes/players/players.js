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
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let position = req.body.position;
        let number = req.body.number;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        Player.where({'user_name': username}).count()
        .then( (result) => { 
            if (result > 0) {
                message = 'Username already exists';
                res.render('add-player.ejs', {
                    message,
                    title: 'Welcome to Socka | Add a new player'
                });                
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the player's details to the database
                        Player.forge({'first_name': first_name,
                                        'last_name': last_name,
                                        'position': position,
                                        'number': number,
                                        'image': image_name,
                                        'user_name': username
                        }).save(null,{method: 'insert'}).then((result) => {
                            res.redirect(root_dir + '/');
                        }).catch((err) => {
                            res.status(500).send(err);
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-player.ejs', {
                        message,
                        title: 'Welcome to Socka | Add a new player'
                    });
                }
            }
        }).catch( (err) => { 
            res.status(500).send(err);
            console.log(err.message); 
        });
    },

    editPlayerPage: (req, res) => {
        let playerId = req.params.id;

        Player.where({'id': playerId}).fetch()
        .then((result) => {
            res.render('edit-player.ejs', {
                title: 'Edit  Player'
                ,player: result.toJSON()
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

        Player.forge({id: playerId})
        .save({first_name: first_name,
                last_name: last_name,
                position: position,
                number: number},
            {method: 'update'})
        .then((result) => { res.redirect(root_dir + '/'); })
        .catch((err) => { res.status(500).send(err); });
    },

    deletePlayer: (req, res) => {
        let playerId = req.params.id;

        Player.forge({id: playerId}).destroy()
        .then((result) => { res.redirect(root_dir + '/'); })
        .catch((err) => { res.status(500).send(err); });
    }
};

