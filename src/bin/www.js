"use strict";

const app = require("../app");

const port_number = 80;

app.listen(port_number, () => {
    console.log("server is running in port : " + port_number);
});