const db = require("../db/databaseConfig");
const dbConn = db.getConnection();

const genre = {

    insertNewGenre: function(genreInfo,callback) {
        dbConn.connect(function (err) {
            const insertNewGenreQuery = `INSERT INTO genre (genre, description) VALUES(?,?);`;
            dbConn.query(insertNewGenreQuery,[genreInfo.genre, genreInfo.description],(error) => {
                if (error) {
                    return callback(error);
                };
                return callback(null);
            }); // end of query
        }); // end of connect function
    }, // end of insertNewGenre function
    findAllGenre: function(callback) {
        dbConn.connect(function (err) {
            const findAllUserQuery = "SELECT * FROM genre;";
            dbConn.query(findAllUserQuery,(error, results) => {
                if (error) {
                    return callback(error, null);
                }; // end of if error
                return callback(null, results);
            }); // end of query
        }); // end of connect function
    }, // end of findAllGenre function
    getGenreIDByGenreName: function(genreName,callback) {
        dbConn.connect(function(err) {
            const getGenreIDByGenreNameQuery = `SELECT genreid FROM genre WHERE genre = ?`;
            dbConn.query(getGenreIDByGenreNameQuery,[genreName], (error,results) => {
                if (error) {
                    return callback(error,null);
                };
                return callback(null,results);
            }); // end of query
        }) // end of connect
    } // end of getGenreIDByGenreName

}; // end of object

module.exports = genre;