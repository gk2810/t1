const Route = require("express").Router();
const user = require("../controllers/user");
const authMiddleware = require("../middleware/authenticate");

Route.post("/register", user.userRegistration);
Route.post("/login", user.login);
Route.post("/logout", user.logout);

module.exports = Route;