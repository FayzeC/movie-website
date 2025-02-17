const db = require("../db/databaseConfig");
const dbConn = db.getConnection();
const bcrypt = require('bcrypt');
const saltRounds = 10;

const user = {

    insertNewUser: function(userInfo,callback) {
        dbConn.connect(function (err) {
            const insertNewUserQuery = `INSERT INTO user (username, email, contact, password, type, profile_pic_url) VALUES(?,?,?,?,?,?);`;
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(userInfo.password, salt, function(err, hash) {
                    dbConn.query(insertNewUserQuery,[userInfo.username, userInfo.email, userInfo.contact, hash, userInfo.type, userInfo.profile_pic_url], (error,results) => {
                        if (error) {
                            return callback(error,null);
                        };
                        return callback(null, results);
                    }); // end of query
                }); // end of bcrypt hash
            }); // end of bcrypt gensalt
        }); // end of connect function
    }, // end of insertNewUser function
    findAllUser: function(callback) {
        dbConn.connect(function (err) {
            const findAllUserQuery = "SELECT * FROM user;";
            dbConn.query(findAllUserQuery,(error, results) => {
                if (error) {
                    return callback(error, null);
                }; // end of if error
                return callback(null, results);
            }); // end of query
        }); // end of connect function
    }, // end of findAllUser function
    findUserByID: function(userID,callback) {
        dbConn.connect(function(err) {
            const findUserByIDQuery = "SELECT * FROM user WHERE userid = ?;";
            dbConn.query(findUserByIDQuery,[userID], (error,results) => {
                if (error) {
                    return callback(error, null);
                };
                return callback(null, results);
            }); // end of query
        }); // end of connect function
    }, // end of findUserByID
    updateUserInfo: function(userID,userInfo,callback) {
        dbConn.connect(function(err) {
            const updateUserInfoQuery = `UPDATE user SET username = ?, email = ?, contact = ?, password = ?, type = ?, profile_pic_url = ? WHERE userid = ?;`;
            bcrypt.genSalt(saltRounds, function(err,salt) {
                bcrypt.hash(userInfo.password,salt, function(err,hash) {
                    dbConn.query(updateUserInfoQuery,[userInfo.username, userInfo.email, userInfo.contact, hash, userInfo.type, userInfo.profile_pic_url,userID], (error,results) => {
                        if (error) {
                            return callback(error,null);
                        };
                        return callback(null,results);
                    }); // end of query
                }); // end of bcrypt hash
            }); // end of bcrypt gensalt
        }); // end of connect function
    }, // end of updateUserInfo function
    verify: function(username, password, callback) {
        dbConn.connect(function(err) {
            const verifyUserQuery = `SELECT * FROM user WHERE username = ? LIMIT 1;`;

            dbConn.query(verifyUserQuery, [username], (error, results) => {
                if (error) {
                    callback(error, null);
                    return;
                }
                if (results.length === 0) {
                    return callback(null, null);
                }
                const user = results[0];
                bcrypt.compare(password, user.password, (error, compareResult) => {
                    if (error) {
                        callback(error, null);
                        return;
                    }
                    if (!compareResult) {
                        callback(null, null);
                        return;
                    }
                    callback(null, user);
                }); // end of bcrypt compare
            }); // end of query
        }); // end of connect
    } // end of verify
};

module.exports = user;
