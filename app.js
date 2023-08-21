const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());



const port = process.env.APP_PORT ?? 5000;
const { hashPassword, verifyPassword, verifyToken } = require("./auth");
const { validateMovie } = require("./movieValidator");
const { validateUser } = require("./userValidator");
const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);


const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandler")

//Public routes
app.post(

  "/api/login",

  userHandlers.getUserByEmailWithPasswordAndPassToNext,

  verifyPassword

);
app.post("/api/users",hashPassword,validateUser, userHandlers.postUser);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users" , userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

//Protected routes
app.use(verifyToken);

app.post("/api/movies", validateMovie ,movieHandlers.postMovie);
app.put("/api/movies/:id",validateMovie, movieHandlers.editMovie );
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.put("/api/users/:id",hashPassword, validateUser,userHandlers.editUser );
app.delete("/api/users/:id",hashPassword, userHandlers.deleteUser );

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
