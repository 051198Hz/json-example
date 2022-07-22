const express = require("express");
const app = express();

const home = require("./src/routes/home");
app.use("/", home);


app.set("views","./src/views");


app.set("view engine","ejs");

app.use(express.static(`${__dirname}/src/public`));


module.exports = app;