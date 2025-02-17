const express = require("express");
const app = express();

// Models
const user = require("./models/user");
const genre = require("./models/genre");
const movie = require("./models/movie");
const review = require("./models/review");
const timeslot = require("./models/timeslot");

// import body-parser middleware
const bodyParser = require("body-parser");

// use the middleware
app.use(bodyParser.json()); // put data in the request into body

const cors = require("cors");
app.use(cors());

// JWT Token
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const isLoggedInMiddleware = require("./isLoggedInMiddleware");


// ENDPOINT 1: Add a new user to the database
// Used in: register.html
app.post("/users/",(req,res) => {
    user.insertNewUser(req.body, (error,results) => {
        if (error) {
            console.log(`\n[${error.code}] ${error.sqlMessage}`);
            // username already exists
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(422).send({'Message':'The new username provided already exists'});
                return;
            } else {
                res.status(500).send({'Message':'500 Internal Error'});
                return;
            }; 
        };
        console.log("\n[ENDPOINT 1] Successfully added new user to database");
        res.status(201).send({"userid":results.insertId});
    }); // end of insertNewUser function
}); // end of app.post


// ENDPOINT 2: Find all user's data
app.get("/users/",(req,res) => {
    user.findAllUser((error,users) => {
        if (error) {
            console.log(`\n[${error.code}] ${error.sqlMessage}`);
            res.status(500).send({'Message':'500 Internal Error'});
            return;
        }; // end of if error
        console.log("\n[ENDPOINT 2] Successfully found all user's data");
        res.status(200).send(users);
    }); // end of findAllUser function
}); // end of app.get


// ENDPOINT 3: Retrieve a single user by their id
// Used in: profile.html, updateProfile.html
app.get("/users/:id/", isLoggedInMiddleware,(req,res) => {
    if (isNaN(req.params.id)) {
        res.status(400).send({'Message':'User ID must be a number!'});
        return;
    };
    const userID = parseInt(req.params.id);

    if (userID !== req.decodedToken.user_id) {
        res.status(403).send({'Message':'Unauthorised'});
        return;
    } else {
        user.findUserByID(userID, (error,userInfo) => {
            if (error) {
                console.log(`\n[${error.code}] ${error.sqlMessage}`);
                res.status(500).send({'Message':'500 Internal Error'});
                return;
            };
            if (userInfo.length === 0) {
                res.status(404).send({'Message':'User ID does not exist!'});
                return;
            }; 
            console.log("\n[ENDPOINT 3] Successfully retrieved user information by ID");
            res.status(200).send(userInfo);
        }); // end of findUserByID
    }; // end of if-else
}); // end of app.get


// ENDPOINT 4: Update a single user
// (Admin or registered members only)
// Used in: updateProfile.html
app.put("/users/:id/",isLoggedInMiddleware,(req,res) => {
    if (isNaN(req.params.id)) {
        res.status(400).send({'Message':'User ID must be a number!'});
        return;
    };
    const userID = parseInt(req.params.id);

    if (userID !== req.decodedToken.user_id) {
        res.status(403).send({'Message':'Unauthorised'});
        return;
    } else {
        user.updateUserInfo(userID, req.body, (error, results) => {
            if (error) {
                console.log(`\n[${error.code}] ${error.sqlMessage}`);
                // username already exists
                if (error.code === 'ER_DUP_ENTRY') {
                    res.status(422).send({'Message':'The new username provided already exists'});
                    return;
                } else {
                    res.status(500).send({'Message':'500 Internal Error'});
                    return;
                };
            }; // end of if error
    
            if (results.affectedRows == 0) {
                res.status(404).send({'Message':'User ID given does not exist'});
                return;
            };
    
            console.log("\n[ENDPOINT 4] Successfully updated user information to database");
            res.status(204).send();
        }); // end of updateUserInfo
    }; // end of if-else
}); // end of app.put


// ENDPOINT 5: Insert a new genre
// (Admin only)
// Used in: adminGenre.html
app.post("/genre", isLoggedInMiddleware, (req,res) => {
    if (req.decodedToken.type != "Admin") {
        res.status(403).send({'Message':'Unauthorised'});
        return;
    } else {
        genre.insertNewGenre(req.body,(error) => {
            if (error) {
                console.log(`\n[${error.code}] ${error.sqlMessage}`);
                // genre already exists
                if (error.code === 'ER_DUP_ENTRY') {
                    res.status(422).send({'Message':'The genre name provided already exists'});
                    return;
                } else {
                    res.status(500).send({'Message':'500 Internal Error'});
                    return;
                };
            }; // end of if error
            console.log("\n[ENDPOINT 5] Successfully inserted a new genre to database");
            res.status(204).send();
        }); // end of insertNewGenre function
    }; // end of middleware check type
}); // end of app.post


// ENDPOINT 6: Gets all genre
// Used in: adminEditMovie.html
app.get("/genre",(req,res) => {
    genre.findAllGenre((error,genres) => {
        if (error) {
            console.log(`\n[${error.code}] ${error.sqlMessage}`);
            res.status(500).send({'Message':'500 Internal Error'});
            return;
        }; // end of if error
        console.log("\n[ENDPOINT 6] Successfully sent all genre information");
        res.status(200).send(genres);
    }); // end of findAllGenre function
}); // end of app.get


// ENDPOINT 7: Add a new movie listing to the database
// (Admin only)
// Used in: adminAddMovie.html
app.post("/movie/", isLoggedInMiddleware, (req,res) => {
    if (req.decodedToken.type != "Admin") {
        res.status(403).send({'Message':'Unauthorised'});
        return;
    } else {
        // check if movie title already exists
        movie.findAllMovie((error,movies) => {
            var existingMovieTitleArr = [];
            for (var i in movies) {
                existingMovieTitleArr.push(movies[i].title);
            };
            
            for(var i = 0; i < existingMovieTitleArr.length; i++) {
                if(req.body.title.trim() == existingMovieTitleArr[i]) {
                    var movieTitleExist = true;
                    break;
                } else {
                    var movieTitleExist = false;
                };
            };

            if (movieTitleExist == true) {
                res.status(422).send({'Message':'The movie title provided already exists'});
                return;
            } else {
                // Check if given genreID exists in the genre table before inserting a new movie
                genre.findAllGenre((error,genres) => {
                    // Push all genreID from sql database into existingGenresArr
                    var existingGenresArr = [];
                    for (var i in genres) {
                        existingGenresArr.push(genres[i].genreid.toString());
                    };

                    // Split multiple genreIDs from user into an array
                    var reqBodyGenreID = req.body.genreid.split(",")

                    // Search if the user input's genreID exists within the database
                    for (var i = 0; i < reqBodyGenreID.length; i++) {
                        if(existingGenresArr.indexOf(reqBodyGenreID[i]) > -1) {
                            var genreIDexist = true;
                        } else {
                            var genreIDexist = false;
                        };
                    };
                    
                    // if genreID does not exist, return error message
                    if (genreIDexist == false) {
                        res.status(404).send({'Message':'Please select a genre!'});
                        return;
                    } else {
                        movie.insertNewMovie(req.body,(error, movie) => {
                            if (error) {
                                console.log(`\n[${error.code}] ${error.sqlMessage}`);
                                res.status(500).send({'Message':'500 Internal Error'});
                                return;
                            };
                            console.log("\n[ENDPOINT 7] Successfully added new movie listing to database");
                            res.status(201).send({"movieid":movie.insertId});
                        }); // end of insertNewMovie function
                    }; // end of if-else
                }); // end of findAllGenre function
            } // end of else
        }); // end of findAllMovie
    }; // end of check admin middleware
}); // end of app.post


// ENDPOINT 8: Retrives all movie listings from Movie Table
// Used in: adminAddTimeslot.html, adminDeleteMovie.html, adminDeleteTimeslot.html, adminEditMovie.html, home.html, movieDetails.html, searchResults.html
app.get("/movie/",(req,res) => {
    movie.findAllMovie((error,results) => {
        if (error) {
            console.log(`\n[${error.code}] ${error.sqlMessage}`);
            res.status(500).send({'Message':'500 Internal Error'});
            return;
        }; // end of if error
        console.log("\n[ENDPOINT 8] Successfully sent all movie listings");
        res.status(200).send(results);
    }); // end of findAllMovie function
}); // end of app.get


// ENDPOINT 9: Retrieves movie data of movie with matching movie id. Note that the genre names must be extracted from the relationship table.
// Used in: addReview.html
app.get("/movie/:id",(req,res) => {
    if (isNaN(req.params.id)) {
        res.status(400).send({'Message':'MovieID given is not a number!'});
        return;
    };
    const movieID = parseInt(req.params.id);

    movie.findMovieByID(movieID,(error,result) => {
        if (error) {
            console.log(`\n[${error.code}] ${error.sqlMessage}`);
            res.status(500).send({'Message':'500 Internal Error'});
            return;
        };
        if (result == null) { 
            res.status(404).send({'Message':'Movie ID does not exist!'});
            return;
        };
        console.log("\n[ENDPOINT 9] Successfully sent movie data by movieID");
        res.status(200).send(result);
    }); // end of findMovieByID
}); // end of app.get


// ENDPOINT 10: Deletes a movie listing given its id. The associated reviews related to the movie listing would also be deleted. Idempotent. 
// (Admin only)
// Used in: adminDeleteMovie.html
app.delete("/movie/:id", isLoggedInMiddleware,(req,res) => {
    if (isNaN(req.params.id)) {
        res.status(400).send({'Message':'MovieID given is not a number!'});
        return;
    };
    const movieID = parseInt(req.params.id);

    if (req.decodedToken.type != "Admin") {
        res.status(403).send({'Message':'Unauthorised'});
        return;
    } else {
        movie.deleteMovieByID(movieID,(error,results) => {
            if (error) {
                console.log(`\n[${error.code}] ${error.sqlMessage}`);
                res.status(500).send({'Message':'500 Internal Error'});
                return;
            };
            var fileName = results[0]["poster_filename"];
            if (fileName != "default.jpg") {
                var filePath = "./upload/movie_posters/" + fileName;
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send({'Message':'500 Internal Error'});
                        return;
                    };
                }); // end of unlinkFile 
            }
            console.log("\n[ENDPOINT 10] Successfully deleted movie listing from database");
            res.status(204).send();
        }); // end of deleteMovieByID
    }; // end of check admin middleware
}); // end of app.delete


// ENDPOINT 11: Adds a review for a movie listing. A movie listing can have many reviews. 
// (Register members/customer only)
// Used in: addReview.html
app.post("/movie/:id/review",isLoggedInMiddleware, (req,res) => {
    if (isNaN(req.params.id)) {
        res.status(400).send({'Message':'MovieID given is not a number!'});
        return;
    };
    
    const movieID = parseInt(req.params.id);
    var userID = parseInt(req.body.userid);

    if (userID == req.decodedToken.user_id && req.decodedToken.type == "Customer") {
        review.addReview(movieID,req.body,(error,review) => {
            if (error) {
                console.log(`\n[${error.code}] ${error.sqlMessage}`);
                if (error.errno === 1452) {
                    res.status(404).send({'Message':'Movie ID given does not exist'});
                    return;
                } else {
                    res.status(500).send({'Message':'500 Internal Error'});
                    return;
                };
            };
            if (review == null) {
                res.status(500).send({'Message':'Review already exists!'});
                return;
            };
            console.log("\n[ENDPOINT 11] Successfully added review to database");
            res.status(201).send({"reviewid":review.insertId});
        }); // end of addReview
    } else {
        res.status(403).send({'Message':'Unauthorised'});
        return;
    }; // end of if-else
}); // end of app.post


// ENDPOINT 12: Retrieves all the reviews of a particular movie, including the username of the reviewer (tables join required).
// Used in: movieDetails.html
app.get("/movie/:id/reviews",(req,res) => {
    if (isNaN(req.params.id)) {
        res.status(400).send({'Message':'MovieID given is not a number!'});
        return;
    };
    const movieID = parseInt(req.params.id);

    movie.findMovieByID(movieID, (error,result) => {
        if (error) {
            console.log(`\n[${error.code}] ${error.sqlMessage}`);
            res.status(500).send({'Message':'500 Internal Error'});
            return;
        };
        if (result == null) { 
            res.status(404).send({'Message':'Movie ID does not exist!'});
            return;
        };
        review.getAllReviewByMovieID(movieID,(error,results) => {
            if(error) {
                console.log(`\n[${error.code}] ${error.sqlMessage}`);
                res.status(500).send({'Message':'500 Internal Error'});
                return;
            };
            console.log("\n[ENDPOINT 12] Successfully sent review");
            res.status(200).send(results);
        }); // end of getAllReviewByMovieID
    }); // end of findMovieByID
}); // end of app.get


// ADVANCED FEATURE 1: Endpoint for image uploading/storage of movie listing
const multer = require("multer");
const path = require("path");
const fs = require('fs'); //Filestream 
app.use('/moviePoster',express.static('upload/movie_posters'));


const storage = multer.diskStorage({
    destination: './upload/movie_posters', // Filepath to store uploaded images
    filename: (req,file,callback) => {
        // returns filename
        return callback(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req,file,callback) => {
        // If the uploaded file is not in jpeg format, return error message 
        if (file.mimetype !== 'image/jpeg') {
            req.fileValidationError = {'Message':'File uploaded is not in .jpg format! Please try again.'};
            return callback(new Error("File uploaded is not in .jpg format!"),false);
        };
        callback(null, true);
    },
    limits: { // Set the limit for filesize and number of files
        fileSize: 1000000, // 1MB
        files: 1
    }
}).single('moviePoster'); // .single ensure only one file is uploaded, 'moviePoster' is the key used when uploading images


// ENDPOINT 13: Upload/storage of movie poster
// (Admin only)
// Used in: adminAddMovie.html
app.post("/upload/:movieID/poster/", isLoggedInMiddleware, function(req,res) {
    if (isNaN(req.params.movieID)) {
        res.status(400).send({'Message':'MovieID given is not a number!'})
        return;
    };
    const movieID = parseInt(req.params.movieID);

    if (req.decodedToken.type != "Admin") {
        res.status(403).send({'Message':'Unauthorised'});
        return;
    } else {
        upload(req,res,function(err) {
            if (req.fileValidationError) {
                return res.send(req.fileValidationError);
            };
            if (err instanceof multer.MulterError) {
                res.status(400).send({"Message":err.message});
                return;
            };
            
            const fileName = req.file.filename;

            movie.addMoviePosterFileName(movieID,fileName,(error) => {
                if (error) {
                    console.log(`\n[${error.code}] ${error.sqlMessage}`);
                    res.status(500).send({'Message':'500 Internal Error'});
                    return;
                };
                console.log("\n[ENDPOINT 13] Successfully uploaded movie poster");
                res.status(200).send({"Message":"Upload successful!"});
            }); // end of addMoviePosterFilename
        }); // end of upload function
    }; // end of check admin middleware
}); // end of app.post


// ENDPOINT 14: Retrieval of movie poster based on movie ID
// Used in: home.html
app.get("/retrieve/:movieID/poster/",(req,res) => {
    if (isNaN(req.params.movieID)) {
        res.status(400).send({'Message':'MovieID given is not a number!'})
        return;
    };
    const movieID = parseInt(req.params.movieID);

    movie.getImageFileName(movieID,(error,result) => {
        if (result.length == 0) {
            res.status(500).send({'Message':'This movieID does not exist'});
            return;
        };

        var fileName = result[0]["poster_filename"];
        var filePath = "./upload/movie_posters/" + fileName;

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                if (err.errno === -4058) {
                    res.status(404).send({'Message':'The movie poster does not exist!'});
                    return;
                }
                res.status(500).send({'Message':'500 Internal Error'});
                return;
            };
            console.log("\n[ENDPOINT 14] Successfully sent movie poster");
            res.json({'moviePoster_url':`http://localhost:3000/moviePoster/${fileName}`})
        }); // end of readFile 
    }); // end of getImageFileName 
}); // end of app.get


// ENDPOINT 15: Delete movie poster based on movieID
app.delete("/delete/:movieID/poster/",(req,res) => {
    if (isNaN(req.params.movieID)) {
        res.status(400).send({'Message':'MovieID given is not a number!'})
        return;
    };
    const movieID = parseInt(req.params.movieID);

    movie.getImageFileName(movieID,(error,result) => {
        if (JSON.stringify(result) == "[]") {
            res.status(404).send({'Message':'Movie ID does not exist'});
            return;
        };
        if (error) {
            console.log(`\n[${error.code}] ${error.sqlMessage}`);
            res.status(404).send({'Message':'Movie poster not found!'});
            return;
        } else {
            var fileName = result[0]["poster_filename"];
            var filePath = "./upload/movie_posters/" + fileName;

            if (fileName == null) {
                res.status(500).send({'Message':'This movieID has no poster to be deleted. Please use POST to insert a new poster!'});
                return;
            } else {
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send({'Message':'500 Internal Error'});
                        return;
                    };
                    console.log("\n[ENDPOINT 15] Poster successfully deleted!");
                }); // end of unlinkFile 
    
                movie.deleteFileName(movieID,(error) =>{
                    if (error) {
                        console.log(`\n[${error.code}] ${error.sqlMessage}`);
                        res.status(500).send({'Message':'500 Internal Error'});
                        return;
                    };
                    res.status(200).send({'Message':'Poster successfully deleted!'});
                }); // end of deleteFileName
            }; // end of else
        }; // end of else
    }); // end of getImageFileName 
}); // end of app.delete


// ENDPOINT 16: Update movie poster based on movieID
// (Admin only)
// Used in: adminEditMovie.html
app.put("/update/:movieID/poster/", isLoggedInMiddleware,(req,res) => {
    if (isNaN(req.params.movieID)) {
        res.status(400).send({'Message':'MovieID given is not a number!'})
        return;
    };
    const movieID = parseInt(req.params.movieID);

    if (req.decodedToken.type != "Admin") {
        res.status(403).send({'Message':'Unauthorised'});
        return;
    } else {
        movie.getImageFileName(movieID,(error,result) => {
            if(error) {
                console.log(`\n[${error.code}] ${error.sqlMessage}`);
                res.status(500).send({'Message':'500 Internal Error'});
                return;
            }

            var fileName = result[0]["poster_filename"];

            upload(req,res,function(err) {
                if (req.fileValidationError) {
                    return res.send(req.fileValidationError);
                };
                if (err instanceof multer.MulterError) {
                    res.status(400).send({"Message":err.message});
                    return;
                };

                const newFileName = req.file.filename;

                movie.addMoviePosterFileName(movieID,newFileName,(error) => {
                    if (error) {
                        console.log(`\n[${error.code}] ${error.sqlMessage}`);
                        res.status(500).send({'Message':'500 Internal Error'});
                        return;
                    };
                    var filePath = "./upload/movie_posters/" + fileName;
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send({'Message':'500 Internal Error'});
                            return;
                        };
                    }); // end of unlinkFile 
                    console.log("\n[ENDPOINT 16] Successfully updated movie poster");
                    res.status(200).send({'Message':'Update successful!'});
                }); // end of addMoviePosterFilename
            }); // end of upload function
        }); // end of getImageFileName function
    }; // end of if-else
}); // end of app.put 


// ADVANCED FEATURE 2: Create endpoints related to the screening timeslots for specified periods
// ENDPOINT 17: Add a new timeslot based on movie id
// (Admin only)
// Used in: adminAddTimeslot.html
app.post("/timeslot/:movieID", isLoggedInMiddleware, (req,res) => {
    if (isNaN(req.params.movieID)) {
        res.status(400).send({'Message':'MovieID given is not a number!'})
        return;
    };
    const movieID = parseInt(req.params.movieID);

    
    if (req.decodedToken.type != "Admin") {
        res.status(403).send({'Message':'Unauthorised'});
        return;
    } else {
        timeslot.checkTimeslot(movieID, req.body, (error,results) => {
            if (error) {
                console.log(`\n[${error.code}] ${error.sqlMessage}`);
                res.status(500).send({'Message':'500 Internal Error'});
                return;
            };

            if (JSON.stringify(results) == "[]") {
                timeslot.insertTimeslot(movieID, req.body,(error,results) => {
                    if (error) {
                        console.log(`\n[${error.code}] ${error.sqlMessage}`);
                        res.status(500).send({'Message':'500 Internal Error'});
                        return;
                    };
                    console.log("\n[ENDPOINT 17] Timeslot added successfully");
                    res.status(201).send({"id":results.insertId});
                }); // end of insertTimeslot
            } else {
                res.status(400).send({'Message':'This timeslot already exists!'});
                return;
            }; // end of if-else
        }); // end of checkTimeslot
    }; // end of check admin middleware
}); // end of app.post


// ENDPOINT 18: Get screening time of a movie
// Used in: adminDeleteTimeslot.html, movieDetails.html
app.get("/timeslot/:movieID",(req,res) => {
    if (isNaN(req.params.movieID)) {
        res.status(400).send({'Message':'MovieID given is not a number!'})
        return;
    };
    const movieID = parseInt(req.params.movieID);

    timeslot.findTimeslot(movieID, (error,results) => {
        if (error) {
            console.log(`\n[${error.code}] ${error.sqlMessage}`);
            res.status(500).send({'Message':'500 Internal Error'});
            return;
        };
        if (results == null) {
            res.status(404).send({'Message':'This movieID does not exist'});
            return;
        };
        console.log("\n[ENDPOINT 18] Successfully retrieved screening times");
        res.status(200).send(results);
    }); // end of findTimeslot
}); // end of app.get


// ENDPOINT 19: Delete screening timeslot
// (Admin only)
// Used in: adminDeleteTimeslot.html
app.delete("/timeslot/:movieID", isLoggedInMiddleware,(req,res) => {
    if (isNaN(req.params.movieID)) {
        res.status(400).send({'Message':'MovieID given is not a number!'})
        return;
    };
    const movieID = parseInt(req.params.movieID);

    if (req.decodedToken.type != "Admin") {
        res.status(403).send({'Message':'Unauthorised'});
        return;
    } else {
        movie.findMovieByID(movieID, (error,result) => {
            if (error) {
                console.log(`\n[${error.code}] ${error.sqlMessage}`);
                res.status(500).send({'Message':'500 Internal Error'});
                return;
            };
            if (result == null) { 
                res.status(404).send({'Message':'Movie ID does not exist!'});
                return;
            };
            timeslot.deleteTimeslot(movieID,req.body, (error) => {
                if (error) {
                    console.log(`\n[${error.code}] ${error.sqlMessage}`);
                    res.status(500).send({'Message':'500 Internal Error'});
                    return;
                };
                console.log("\n[ENDPOINT 19] Screening time deleted successfully");
                res.status(201).send({'Message':'Timeslot has been removed'});
            }); // end of deleteTimeslot
        }); // end of findMovieByID
    }; // end of if-else
}); // end of app.delete



// ==================================================================
// New APIs added for CA2

// ENDPOINT 20: Allow user login
// Used in: login.html, register.html
app.post("/login/", (req,res) => {

    user.verify(req.body.username, req.body.password, (error,user) => {
        if (error) {
            console.log(error);
            res.status(500).send({'Message':'500 Internal Error'});
            return;
        }
        if (user === null) {
            res.status(401).send();
            return;
        };
        const payload = { user_id: user.userid, type: user.type };
        jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" }, (error, token) => {
            if (error) {
                console.log(error);
                res.status(401).send();
                return;
            };
            res.status(200).send({token: token,user_id: user.userid, userData: user});
        }) // end of jwt sign
        console.log("\n[ENDPOINT 20] User login success");
    });

}); // end of app.post

// ENDPOINT 21: Returns movie details based on movie title searching
// Used in: home.html, searchResults.html
app.get("/searchMovie/:userInput/", (req,res) => {
    var userSearch = req.params.userInput;

    movie.search(userSearch, (error, searchResults) => {
        if (error) {
            console.log(`\n[${error.code}] ${error.sqlMessage}`);
            res.status(500).send({'Message':'500 Internal Error'});
            return;
        };
        if (searchResults == null) {
            res.status(404).send({'Message':'No results found'});
            return;
        };
        console.log("\n[ENDPOINT 21] Successfully sent movie search results");
        res.status(200).send(searchResults);
    });
}); //end of app.get


// ENDPOINT 22: Returns movie details based on genre searching
// Used in: searchResults.html
app.get("/searchMovieByGenre/:userInput/", (req,res) => {
    var userSearch = req.params.userInput;

    movie.searchByGenre(userSearch, (error, searchResults) => {
        if (error) {
            console.log(`\n[${error.code}] ${error.sqlMessage}`);
            res.status(500).send({'Message':'500 Internal Error'});
            return;
        };
        if (searchResults == null) {
            res.status(404).send({'Message':'No results found'});
            return;
        };
        console.log("\n[ENDPOINT 22] Successfully sent movie search results by genre");
        res.status(200).send(searchResults);
    }); // end of searchByGenre

}); // end of app.get


// ENDPOINT 23: Returns genre id based on genre name
// Used in: adminAddMovie.html, adminEditMovie.html
app.get("/genre/:genreName/", (req,res) => {
    var genreName = req.params.genreName;

    genre.getGenreIDByGenreName(genreName, (error,results) => {
        if (error) {
            console.log(`\n[${error.code}] ${error.sqlMessage}`);
            res.status(500).send({'Message':'500 Internal Error'});
            return;
        };
        if (results == null) {
            res.status(404).send({'Message':'No results found'});
            return;
        };
        console.log("\n[ENDPOINT 23] Successfully sent genre id");
        res.status(200).send(results);
    }); // end of getGenreIDByGenreName

}); // end of app.get


// ENDPOINT 24: Edit movie details
// (Admin only)
// Used in: adminEditMovie.html
app.put("/movie/:movieID", isLoggedInMiddleware, (req,res) => {
    if (isNaN(req.params.movieID)) {
        res.status(400).send({'Message':'MovieID given is not a number!'})
        return;
    };
    
     if (req.decodedToken.type != "Admin") {
        res.status(403).send({'Message':'Unauthorised'});
        return;
    } else {
        const movieID = parseInt(req.params.movieID);
        movie.editMovie(movieID,req.body,(error,results) => {
            if (error) {
                console.log(`\n[${error.code}] ${error.sqlMessage}`);
                res.status(500).send({'Message':'500 Internal Error'});
                return;
            }
            movie.editMovieGenres(movieID, req.body, (error,results) => {
                if (error) {
                    console.log(`\n[${error.code}] ${error.sqlMessage}`);
                    res.status(500).send({'Message':'500 Internal Error'});
                    return;
                }
                console.log("\n[ENDPOINT 24] Successfully edit movie");
                res.status(204).send({'Message':'Update Success'});
            }); // end of editgenre          
        }); // end of editMovie
    }; // end of if-else
}); // end of app.put

module.exports = app;