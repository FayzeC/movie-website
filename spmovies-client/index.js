const express = require("express");
const app = express();
app.use(express.static('public'));

app.get("/", (req, res) => {
  res.sendFile("public/home.html", { root: __dirname });
});

app.get("/login/", (req, res) => {
    res.sendFile("public/login.html", { root: __dirname });
});

app.get("/profile/", (req, res) => {
  res.sendFile("public/profile.html", { root: __dirname });
});

app.get("/updateProfile/", (req, res) => {
  res.sendFile("public/updateProfile.html", { root: __dirname });
});

app.get("/register/", (req, res) => {
  res.sendFile("public/register.html", { root: __dirname });
});

app.get("/searchResults/", (req, res) => {
  res.sendFile("public/searchResults.html", { root: __dirname });
});

app.get("/movieDetails/", (req, res) => {
  res.sendFile("public/movieDetails.html", { root: __dirname });
});

app.get("/addReview/", (req, res) => {
  res.sendFile("public/addReview.html", { root: __dirname });
});

app.get("/adminDashboard/", (req, res) => {
  res.sendFile("public/adminDashboard.html", { root: __dirname });
});

app.get("/adminAddMovie/", (req, res) => {
  res.sendFile("public/adminAddMovie.html", { root: __dirname });
});

app.get("/adminDeleteMovie/", (req, res) => {
  res.sendFile("public/adminDeleteMovie.html", { root: __dirname });
});

app.get("/adminEditMovie/", (req, res) => {
  res.sendFile("public/adminEditMovie.html", { root: __dirname });
});

app.get("/adminGenre/", (req, res) => {
  res.sendFile("public/adminGenre.html", { root: __dirname });
});

app.get("/adminAddTimeslot/", (req, res) => {
  res.sendFile("public/adminAddTimeslot.html", { root: __dirname });
});

app.get("/adminDeleteTimeslot/", (req, res) => {
  res.sendFile("public/adminDeleteTimeslot.html", { root: __dirname });
});

app.get("/adminRegister/", (req, res) => {
  res.sendFile("public/adminRegister.html", { root: __dirname });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Client server has started listening on port ${PORT}`);
});