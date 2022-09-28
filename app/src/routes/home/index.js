"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

router.get("/", ctrl.output.home);
router.get("/login", ctrl.output.login);
router.get("/img",ctrl.output.img);
//브라우저가 주소창으로 서버에 요청한것 처리 get

router.post("/login",ctrl.process.login);
router.post("/load",ctrl.process.load);
//아마 fetch같은걸로 POST요청하면 처리되는듯
module.exports = router;