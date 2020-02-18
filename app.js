const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const port = 4000;

//*** The next 3 lines have been moved to ./routes/route-players.js.
// const {getHomePage} = require('./routes/index');
// const {addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage} = 
// 		require('./routes/players');

/*** Db connection has been adapted to make use of bookshelf ORM.
// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'romario',
    password: 'dasouza',
    database: 'socka'
});

// connect to database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});
global.db = db;
*/

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', path.join(__dirname, '/views/players')); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// players routes
var players = require('./routes/route-players');
app.use('/players', players);

/**** app routes have been moved to ./routes/route-players.js
app.get('/', getHomePage);
app.get('/add', addPlayerPage);
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);
app.post('/add', addPlayer);
app.post('/edit/:id', editPlayer);
*/

// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
