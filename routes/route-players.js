var express = require('express');
var router = express.Router();

const {getHomePage} = require('./players/index');
const {addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage} = 
		require('./players/players');

router.get('/', getHomePage);
router.get('/add', addPlayerPage);
router.get('/edit/:id', editPlayerPage);
router.get('/delete/:id', deletePlayer);
router.post('/add', addPlayer);
router.post('/edit/:id', editPlayer);

module.exports = router;
