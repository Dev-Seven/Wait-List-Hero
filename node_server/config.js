var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'sevensquare',
    password: 'Sevensquare@99',
    database: 'WaitListHero'
});
connection.connect(function(err) {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log(err.message);
    }
});
module.exports = connection;