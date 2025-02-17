This project is a website that provides user registration, publication of movie listing info, insertion of movies and viewer reviews.

Web Page Summary
1. General Public
- login.htm: Allows user login. Login form also links to register.html
- register.html:	Allows public user sign up as member. Auto login and redirected to home.html upon successful registration
- home.html: Allows live searching by movie title or genre and shows popular movies. Redirects to searchResults.html when user submit search. Logout or login buttons will be showed depending on user type
- searchResults.html: Displays search results and buttons to view movie details. Also includes searchbox
- movieDetails.html:	Display movie info, average rating and reviews. Add review button only appears for registered members
  
2. Registered Members
- profile.html:	Display user profile. Includes button to update profile
- updateProfile.html: Update profile information (username, email, contact, password). Admins can also update profile
- addReview.html:	Add review and rating.	User can only leave a review once on each movie

3. Admins
- adminDashboard.html:	Displays all buttons that links to other admin pages	
- adminAddMovie.html:	Allow admin to add movie. Includes uploading movie poster
- adminEditMovie.html:	Allow admin to edit movie. Includes editing movie poster (existing details are inserted into the form)
- adminDeleteMovie.html:	Allow admin to delete movie	
- adminGenre.html:	Allow admin to add new genre. Duplicate genre name not allowed
- adminAddTimeslot.html:	Allow admin to add a timeslot for a specific movie.	Duplicate timeslot not allowed
- adminDeleteTimeslot.html:	Allow admin to delete a timeslot for a specific movie	
- adminRegister.html:	Register a new admin account	
