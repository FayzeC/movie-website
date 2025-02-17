const db = require("../db/databaseConfig");
const dbConn = db.getConnection();

const movie = {

    insertNewMovie: function(movieInfo,callback) {
        dbConn.connect(function(err) {
            const insertNewMovieQuery = `INSERT INTO movie (title, description, cast, time, opening_date, poster_filename) VALUES(?,?,?,?,?,?);`;
            const insertNewMovieGenresQuery = `INSERT INTO movie_genres (movieid, genreid) VALUES(?,?);`;
            var genreIDarray = movieInfo.genreid.split(",");
            dbConn.query(insertNewMovieQuery,[movieInfo.title, movieInfo.description, movieInfo.cast, movieInfo.time, movieInfo.opening_date, movieInfo.poster_filename], (error,results) => {
                if (error) {
                    return callback(error,null);
                };
                genreIDarray.map(genreID => {
                    dbConn.query(insertNewMovieGenresQuery, [results.insertId, genreID], (error) => {
                        if (error) {
                            return callback(error,null);
                        };
                    }); // end of query for insertNewMovieGenresQuery
                }); // end of map
                return callback(null,results);
            }); // end of query for insertNewMovieQuery
        }); // end of connect function
    }, // end of insertNewMovie function
    findAllMovie: function(callback) {
        dbConn.connect(function(err) {
            const findAllMovieQuery = `SELECT movieid, title, description, cast, time, opening_date FROM movie;`;
            dbConn.query(findAllMovieQuery,(error,results) => {
                if (error) {
                    return callback(error,null);
                }; // end of if error
                return callback(null,results);
            }); // end of query
        }); // end of connect function
    }, // end of findAllMovie function
    findMovieByID: function(movieID,callback) {
        dbConn.connect(function(err) {
            const findMovieByIDQuery = `SELECT * FROM movie WHERE movieid = ?;`;
            const findMovieGenre = `SELECT genre FROM genre WHERE genreid IN (SELECT genreid FROM movie_genres WHERE movieid = ?);`;
            dbConn.query(findMovieByIDQuery,[movieID],(error,movieData) => {
                if (movieData.length == 0) {
                    return callback(null,null);
                };
                dbConn.query(findMovieGenre, [movieID],(error, movieGenres) => {
                    if (error) {
                        return callback(error,null);
                    };
                    var genreArr = [];
                    for (var i in movieGenres) {
                        genreArr.push(movieGenres[i]["genre"]);
                    };
                    var genreStr = genreArr.toString();
                    movieData[0]["genres"] = genreStr;
                    return callback(null,movieData);
                }); // end of query for findMovieGenre
            }); // end of query for findMovieByIDQuery
        }); // end of connect function
    }, // end of findMovieByID function
    deleteMovieByID: function(movieID,callback) {
        dbConn.connect(function(err) {
            const getPosterFileName = `SELECT poster_filename FROM movie WHERE movieid = ?;`;
            const deleteMovieByIDQuery = `DELETE FROM movie WHERE movieid = ?;`;
            dbConn.query(getPosterFileName,[movieID],(error,filename) => {
                if (error) {
                    return callback(error,null);
                };
                dbConn.query(deleteMovieByIDQuery, [movieID], (error, results) => {
                    if (error) {
                        return callback(error,null);
                    };
                    return callback(null, filename);
                }); // end of query
            }); // end of query
        }); // end of connect function
    }, // end of deleteMovieByID
    // BONUS REQUIREMENT 1
    addMoviePosterFileName: function(movieID,fileName,callback) {
        dbConn.connect(function(err) {
            const addMoviePosterFileNameQuery = `UPDATE movie SET poster_filename = ? WHERE movieid = ?;`;
            dbConn.query(addMoviePosterFileNameQuery,[fileName,movieID], (error) => {
                if (error) {
                    return callback(error);
                };
                return callback(null);
            }); // end of query
        }); // end of connect
    }, // end of addMoviePosterFileName
    getImageFileName: function(movieID,callback) {
        dbConn.connect(function(err) {
            const getImageFileNameQuery = `SELECT poster_filename FROM movie WHERE movieid = ?;`;
            dbConn.query(getImageFileNameQuery,[movieID],(error,results) => {
                if (error) {
                    return callback(error,null);
                };
                return callback(null,results);
            }); // end of query
        }); // end of connect
    }, // end of getImageFileName
    deleteFileName: function(movieID,callback) {
        dbConn.connect(function(err) {
            const deleteFileNameQuery = `UPDATE movie SET poster_filename = NULL WHERE movieid = ?;`;
            dbConn.query(deleteFileNameQuery,[movieID],(error) => {
                if (error) {
                    return callback(error);
                };
                return callback(null);
            });
        });
    }, // end of deleteFileName
    // CA2 
    search: function(userSearch, callback) {
        dbConn.connect(function(err) {
            dbConn.query(`SELECT * FROM movie WHERE title LIKE '%${userSearch}%'`, (error, searchResults) => {
                if (error) {
                    return callback(error,null);
                }
                return callback(null,searchResults);
            }); // end of query
        }); // end of connect
    }, // end of search 
    searchByGenre: function(userSearch, callback) {
        dbConn.connect(function(err) {
            dbConn.query(`SELECT DISTINCT movie.movieid FROM movie INNER JOIN movie_genres ON movie.movieid = movie_genres.movieid LEFT JOIN genre ON genre.genreid = movie_genres.genreid WHERE genre.genre LIKE '%${userSearch}%';`, (error, searchResults) => {
                if (error) {
                    return callback(error,null);
                }
                return callback(null, searchResults);
            }); // end of query
        }); // end of connect
    },
    getGenreIDByGenreName: function(genreName, callback) {
        dbConn.connect(function(err) {
            const getGenreIDByGenreNameQuery = `SELECT genreid FROM genre WHERE genre = ?`;
            dbConn.query(getGenreIDByGenreNameQuery,[genreName], (error,results) => {
                if (error) {
                    return callback(error,null);
                };
                return callback(null,results);
            }); // end of query
        }) // end of connect
    }, // end of getGenreIDByGenreName
    editMovie: function(movieID, newMovieInfo, callback) {
        dbConn.connect(function(err) {
            const editMovieQuery = `UPDATE movie SET title = ?, description = ?, cast = ?, time = ?, opening_date = ? WHERE movieid = ?;`;
            dbConn.query(editMovieQuery, [newMovieInfo.title, newMovieInfo.description, newMovieInfo.cast, newMovieInfo.time, newMovieInfo.opening_date, movieID], (error,results) => {
                if (error) {
                    return callback(error,null);
                };
                return callback(null,results);
            }); // end of query
        }); // end of connect
    }, // end of editMovie
    editMovieGenres: function(movieID, newMovieInfo,callback) {
        const deleteMovieGenresQuery = `DELETE FROM movie_genres WHERE movieid = ?`;
        const insertNewGenresQuery = `INSERT INTO movie_genres (movieid,genreid) VALUES(?,?);`;
        var genreIDarray = newMovieInfo.genreid.split(",");
        dbConn.query(deleteMovieGenresQuery, [movieID], (error,results) => {
            if (error) {
                return callback(error,null);
            };
            genreIDarray.map(genreID => {
                dbConn.query(insertNewGenresQuery, [movieID, genreID], (error) => {
                    if (error) {
                        return callback(error,null);
                    }
                }); // end of query for insertNewGenres
            }); // end of map
            return callback(null,results);
        }); // end of query for deleteMovieGenres
    } // end of editMovieGenres

}; // end of movie object

module.exports = movie;