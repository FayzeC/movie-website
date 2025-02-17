const db = require("../db/databaseConfig");
const dbConn = db.getConnection();

const timeslot = {

    insertTimeslot: function(movieID, data,callback) {
        dbConn.connect(function(err) {
            const insertTimeslotQuery = `INSERT INTO screening_timeslots (movieid,timeslot) VALUES(?,?);`;
            dbConn.query(insertTimeslotQuery,[movieID,data.screening_timeslot], (error,results) => {
                if (error) {
                    return callback(error,null);
                };
                return callback(null,results);
            }); // end of query
        }); // end of connect
    }, // end of insertTimeslot function
    findTimeslot:function(movieID, callback) {
        dbConn.connect(function(err) {
            const findTimeslotQuery = `SELECT timeslot FROM screening_timeslots WHERE movieid = ? ORDER BY timeslot;`;               
            dbConn.query(findTimeslotQuery, [movieID], (error,timeslots) => {
                if(error) {
                    return callback(error,null);
                }
                if (timeslots.length == 0) {
                    return callback(null,false)
                };
                return callback(null, timeslots);
            }); // end of query for findTimeslot
        }); // end of connect
    }, // end of findTimeslot function
    deleteTimeslot: function(movieID,data, callback) {
        dbConn.connect(function(err) {
            const deleteTimeslotQuery = `DELETE FROM screening_timeslots WHERE movieid = ? AND timeslot = ?;`;
            dbConn.query(deleteTimeslotQuery, [movieID,data.screening_timeslot], (error) => {
                if (error) {
                    return callback(error);
                };
                return callback(null);
            }); // end of query
        }); // end of connect
    }, // end of deleteTimeslot function
    checkTimeslot: function(movieID, data, callback) {
        dbConn.connect(function(err) {
            const checkTimeslotQuery = `SELECT id FROM screening_timeslots WHERE movieid = ? AND timeslot = ?;`;
            dbConn.query(checkTimeslotQuery,[movieID,data.screening_timeslot], (error,results) => {
                if (error) {
                    return callback(error,null);
                };
                return callback(null,results);
            }); // end of query
        }); // end of connect
    } // end of checkTimeslot
    
}; // end of timeslot object

module.exports = timeslot;