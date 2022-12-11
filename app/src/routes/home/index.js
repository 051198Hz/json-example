"use strict";

const express = require("express");
const router = express.Router();
const multer = require('multer');
var path = require('path');

const uploadAudio = multer({
    // storage : 어디에 저장할 것인지
    // 서버 디스크에 저장하거나 AWS S3와 같은 외부에 저장합니다.
    // multer-s3나 multer-google-storage와 같은 모듈을 찾아서 활용해봅시다
    storage: multer.diskStorage({
        //destination은 저장할 경로. 동일 경로 내 uploads에 저장할 것임.
        // uploads 폴더를 생성해 둘 것.
        destination(req, file, cb) {
            cb(null, `${__dirname}/../../public/audio/`);
        },
        // filename은 저장할 파일의 이름
        filename(req, file, cb) {
            // ext는 확장자 명을 말합니다.
            const ext = path.extname(file.originalname.normalize());
            // basename은 파일 이름입니다. 파일 이름 + 현재 시간 + 확장자로 정하겠습니다.
            //날짜를 붙이는 건 중복을 피하기 위함입니다.
            cb(
                null,
                path.basename(Buffer.from(file.originalname, 'latin1').toString('utf8') , ext) /*+ new Date().valueOf() */+ ext
            );
        }
    }),
    // limit : 파일 사이즈 제한 (byte 단위) 아래는 5mb 까지만 허용함을 의미
});

const ctrl = require("./home.ctrl");

router.get("/load",ctrl.output.load);
router.get("/", ctrl.output.home);
router.get("/getFriends", ctrl.output.getFriends);
router.get("/login", ctrl.output.login);
router.get("/portfolio", ctrl.output.portfolio)
router.get("/img", ctrl.output.img);
router.get("/downloadMP3/:filename", ctrl.output.downloadMP3);
router.get("/regiset/", ctrl.output.regiset);
router.get("/addFriends", ctrl.output.addFriends);
router.get("/getPosts", ctrl.output.getPosts);


//브라우저가 주소창으로 서버에 요청한것 처리 get
router.post("/insertPost", ctrl.process.insertPost);
router.post("/login", ctrl.process.login);
router.post("/load", ctrl.process.load);
//router.post("/uploadMP3", ctrl.process.uploadMP3);

router.post('/uploadMP3', uploadAudio.single('mp3'), function (req, res) {
    const title = req.body.title;
    const file = req.file;

    console.log(`mp3 upload ${req.file.filename} started`)

    //console.log(title);
    //console.log(file);
    console.log(`mp3 upload ${req.file.filename} finishied`)

    res.sendStatus(200);
});


//아마 fetch같은걸로 POST요청하면 처리되는듯
module.exports = router;