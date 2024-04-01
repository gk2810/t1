const express = require("express");
const app = express();
require("dotenv").config()
const route = require("./routes/index");
const mongoose = require("mongoose");

console.log("__ process.env.DB_URL __", process.env.DB_URL);

mongoose.connect(process.env.DB_URL).then(() => console.log("DB connected ")).catch(err => console.log("DB connection error >_", err))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("", route.Route);

app.listen(process.env.PORT || 3000, () => {
    console.log(`>_ server is running on port ${process.env.PORT || 3000}`);
});