let Route = require("express").Router();
let userRoute = require("./user");

Route.use("", userRoute);

exports.Route = Route;