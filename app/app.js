const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const home = require("./src/routes/home");

app.set("views","./src/views");
app.set("view engine","ejs");

app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json());
//url을 통해 전달되는 데이터에 한글, 공백등과 같은 문자가 포함될경우 제대로 인식되지 않는 문제 해결
app.use(bodyParser.urlencoded( { extended : true } ) ) ;
app.use("/", home);

module.exports = app;