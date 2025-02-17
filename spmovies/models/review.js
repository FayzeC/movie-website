const db = require("../db/databaseConfig");
const dbConn = db.getConnection();

const review = {

    addReview: function(movieID,reviewInfo,callback) {
        dbConn.connect(function(err) {
            const checkIfReviewExistQuery = `SELECT COUNT(*) FROM reviews WHERE reviews.movieid = ? AND reviews.userid = ?;`;
            const addReviewQuery = `INSERT INTO reviews (movieid,userid,rating,review) VALUES(?,?,?,?);`;
            dbConn.query(checkIfReviewExistQuery,[movieID,reviewInfo.userid],(error,checkResults) => {
                if (checkResults[0]["COUNT(*)"] == 1) {
                    return callback(null,null);
                };
                dbConn.query(addReviewQuery,[movieID, reviewInfo.userid, reviewInfo.rating, reviewInfo.review], (error,results) => {
                    if (error) {
                        return callback(error,null);
                    };
                    return callback(null, results);
                }); // end of query for addReviewQuery
            }); // end of query for checkIfReviewExistQuery
        }); // end of connect
    }, // end of addReview
    getAllReviewByMovieID: function(movieID, callback) {
        dbConn.connect(function(err) {
            const getAllReviewByMovieIDQuery = `SELECT reviews.movieid, reviews.userid, user.username, reviews.rating, reviews.review, reviews.created_at
            FROM reviews INNER JOIN user ON reviews.userid = user.userid AND reviews.movieid = ?;`;
            dbConn.query(getAllReviewByMovieIDQuery, [movieID], (error,results) => {
                if (results.length == 0) {
                    return callback(null,null);
                };
                if (error) {
                    return callback(error,null);
                };
                return callback(null,results);
                }); // end of query
        }); // end of connect
    } // end of getAllReviewByMovieID
    
}; // end of review object

module.exports = review;