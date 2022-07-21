const express = require("express");
const app = express();

app.set("views","./src/views");
app.set("view engine","ejs");

const home = require("./src/routes/home");
app.use(express.static(`${__dirname}/src/public`));
app.use("/",home);

module.exports = app;