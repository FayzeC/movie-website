//+---------------+---------------+
//| Name          | Faye Chan     |
//| Class         | DISM/FT/2A/02 |
//| Admission No. | 2036489       |
//+---------------+---------------+

// redirects user to search results page based on the genre name clicked in navbar
function genreClick(genreName) {
    localStorage.setItem('userSearchGenre',genreName);
    window.location.assign("http://localhost:3001/searchResults.html");
}

// redirects user to movie details page based on the movie title clicked in navbar
function movieClick(movieID) {
    localStorage.setItem('movieID',movieID);
    window.location.assign("http://localhost:3001/movieDetails.html");
}

// function that contains all navbar ajax and events
function headerAjaxCall() {
    const token = localStorage.getItem('token');
    const type = localStorage.getItem('type');
    const loggedInUserID = parseInt(localStorage.getItem('userID'));

    // if-else to check if user is logged in,if not logged in button is appended
    if (token === null || isNaN(loggedInUserID)) {
        console.log("Login generated")
        var loginHTML = `<a href="login.html"><i class="ti-user"></i> Sign in or Register</a>`;
        $("#loginlogout").append(loginHTML);
    } else {  
        console.log("Logout generated")
        var logoutHTML = `<a href="profile.html"><i class="ti-user"></i>Profile</a>
                            <ul class="submenu">
                                <button class="text-dark btn-link" id="logout">Logout</button>
                            </ul>`
        $("#loginlogout").append(logoutHTML);
    }

    // if-else to check if user is admin, if yes admin dashboard is displayed in nav bar
    if (type == "Admin") {
        console.log("Admin dashboard generated");
        var adminDashboardHTML = `<a href="adminDashboard.html">Admin Dashboard</a>`;
        $("#adminDashboard").append(adminDashboardHTML);
    }

    // ajax to allow user to logout
    $("#logout").click(function() {
        console.log("Logout was clicked");
        localStorage.clear();
        window.location.assign("http://localhost:3001/home.html");
    });
    
    
    // ajax to display all genre in dropdown menu
    $.ajax({
        url: `http://localhost:3000/genre` ,
        type: 'GET',
        success: function (data, textStatus, xhr) {
            console.log("Get all genre success!");
            if (data != null) {
                data.forEach((data) => {
                    var displayAllGenreHTML = `<li><a onClick="genreClick('${data.genre}')">${data.genre}</a></li>`
                    $("#genres").append(displayAllGenreHTML);
                });
            } else {
                console.log("Error");
            };
        }, 
        error: function(xhr, textStatus, errorThrown) {
            console.log('Error in Operation');  
            console.log('textStatus: ' + textStatus);
            console.log('errorThrown: ' + errorThrown);
            alert(xhr.responseText);
        }
    }); // end of ajax for get all genre

    // ajax to display all movies in dropdown menu
    $.ajax({
        url: `http://localhost:3000/movie/` ,
        type: 'GET',
        success: function (data, textStatus, xhr) {
            console.log("Get all movie success!");
            if (data != null) {
                data.forEach((data) => {
                    var displayAllMovieHTML = `<li><a onClick="movieClick(${data.movieid})">${data.title}</a></li>`
                    $("#movies").append(displayAllMovieHTML);
                });
            } else {
                console.log("Error");
            };
        }, 
        error: function(xhr, textStatus, errorThrown) {
            console.log('Error in Operation');  
            console.log('textStatus: ' + textStatus);
            console.log('errorThrown: ' + errorThrown);
            alert(xhr.responseText);
        }
    }); // end of ajax for get all movies
}

// function that appends all movie titles as option values
function appendMovieDatalistOptions() {
    $.ajax({
        url: `http://localhost:3000/movie/` ,
        type: 'GET',
        async: false,
        success: function (data, textStatus, xhr) {
            console.log("Get all movie success!");
            if (data != null) {
                data.forEach((data) => {
                    var displayAllMovieHTML = `<option value="${data.title}">${data.title}</option>`
                    $("#titles").append(displayAllMovieHTML);
                });
            } else {
                console.log("Error");
            };
        }, 
        error: function(xhr, textStatus, errorThrown) {
            console.log('Error in Operation');  
            console.log('textStatus: ' + textStatus);
            console.log('errorThrown: ' + errorThrown);
            alert(xhr.responseText);
        }
    }); // end of ajax for get all movies
}

// function that appends all existing genre names as checkboxes
function appendGenreCheckBox(){
    $.ajax({
        url: `http://localhost:3000/genre` ,
        type: 'GET',
        success: function (data, textStatus, xhr) {
            console.log("Get all genre success!");
            if (data != null) {
                data.forEach((data) => {
                    var displayGenreCheckboxHTML = `<div>
                                                        <input type="checkbox" id="${data.genre}" name="movieDetails" value="${data.genre}">
                                                        <label for="${data.genre}">${data.genre}</label>
                                                    </div>`
                    $(".genre_checkbox").append(displayGenreCheckboxHTML);
                });
            } else {
                console.log("Error");
            };
        }, 
        error: function(xhr, textStatus, errorThrown) {
            console.log('Error in Operation');  
            console.log('textStatus: ' + textStatus);
            console.log('errorThrown: ' + errorThrown);
            alert(xhr.responseText);
        }
    }); // end of ajax for get all genre
}

// function to validate if user is customer/ registered member
function checkCustomer() {
    var type = localStorage.getItem('type');

    if(type == "Admin") {
        $("form").hide();
        alert("Only registered members can add movie reviews. Please log out of admin account. ");
        window.location.assign("http://localhost:3001/home.html");
    } else if (type != "Customer") {
        $("form").hide();
        alert("Only registered members can add movie reviews. ");
        window.location.assign("http://localhost:3001/login.html");
    }
}

// function to validate if user is admin
function checkAdmin() {
    var type = localStorage.getItem('type');

    if (type != "Admin") {
        alert("This is an admin classified action. Please login with an Admin account.");
        window.location.assign("http://localhost:3001/login.html");
    }
}

function validateEmptyStr(dataArr) {
    var validation;
    var emptyStrings = dataArr.filter(str => str.trim().length <= 0);
    if (emptyStrings.length > 0) {
        alert("Make sure all input is filled!");
        return validation = false;
    } else {
        return validation = true;
    }
}