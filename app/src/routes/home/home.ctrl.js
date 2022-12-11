const UserStorage = require("../../models/UserStorage");
var multiparty = require('multiparty');
var multer = require('multer');
const url = require('url');
var fs = require('fs');

const output = {

    load: (req, res) => {
        const response = {};
        const songName = req.body.songName,
            albumart = req.body.albumart,
            lyris = req.body.lyris,
            singerName = req.body.singerName;

        console.log(req.body);

        response.success = true;
        response.songName = "남해,경상남도";
        response.albumart = "오늘도 평화로운 남해";
        response.lyris = "지금은 새벽 1시 20분..나는 API를 짜보고이따....";
        response.singerName = "/img/1.jpg"

        return res.json(response);
    },
    home: (req, res) => {
        res.render("home/index");
        //render는 웹페이지 뿌려주는거인듯
    },
    login: (req, res) => {
        res.render("home/login");
    },
    portfolio: (req, res) => {
        res.render("home/portfolio");
    },
    img: (req, res) => {
        console.log(req.params);

        fs.readFile("img" + req.params.img_name, function (err, data) {
            /*
            fs.readFile()에.경로를 써줄 때 절대 경로를 써 줘야 함. 이 폴더까지의 절대경로를 담고있는 변수가 __dirname이라서
            fs.readFile( path.resolve( __dirname, ”상대경로”) 으로 쓴다,,,
            */
            if (err) throw err;
            //console.log('picture file loading....');
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(data);
        })
    },

    downloadMP3: (req, res) => {
        //const { pathname } = url.parse(req.url, true)
        const music = `${__dirname}/../../public/audio/${req.params.filename}`
        console.log(`mp3 streaming ${req.params.filename} started`)
        const stat = fs.statSync(music)
        const fileSize = stat.size
        const range = req.headers.range;

        var readStream;
        // if there is no request about range
        if (range !== undefined) {
            // remove 'bytes=' and split the string by '-'
            var parts = range.replace(/bytes=/, "").split("-");

            var partial_start = parts[0];
            var partial_end = parts[1];

            if ((isNaN(partial_start) && partial_start.length > 1) || (isNaN(partial_end) && partial_end.length > 1)) {
                return res.sendStatus(500);
            }
            // convert string to integer (start)
            var start = parseInt(partial_start, 10);
            // convert string to integer (end)
            // if partial_end doesn't exist, end equals whole file size - 1
            var end = partial_end ? parseInt(partial_end, 10) : stat.size - 1;
            // content length
            var content_length = (end - start) + 1;

            res.status(206).header({
                'Content-Type': 'audio/mpeg',
                'Content-Length': content_length,
                'Content-Range': "bytes " + start + "-" + end + "/" + stat.size
            });

            // Read the stream of starting & ending part
            readStream = fs.createReadStream(music, { start: start, end: end });
        } else {
            res.header({
                'Content-Type': 'audio/mpeg',
                'Content-Length': stat.size
            });
            readStream = fs.createReadStream(music);
        }
        readStream.pipe(res);
    },

    regiset:(req,res)=>{

        var userID = req.query.userID
        var profileImgUrl = req.query.profileImgUrl
        console.log(userID)

        console.log("regiser user runnned")

        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'uplist'
        });
        connection.connect();
        var sql = `INSERT INTO users(id,email,comment,profileImgUrl) VALUES('${userID}','null','null','${profileImgUrl}')`
        try{
            connection.query(sql, function (err, result, fields) {
            //if (err) throw new Error(err);
            console.log(result)
        })}catch(error){
            return res.end()
        }

        sql = `INSERT INTO FriendList(user1,user2) VALUES('${userID}','${userID}')`
        try {
             connection.query(sql, function (err, result, fields) {
                if (err) {
                    return res.sendStatus(204)
                } else {
                    return res.end()
                }
                console.log("result : ", result)
            })
        } catch (err) {
            console.log("error occured!!")

        }

        connection.end();

        console.log("regiser user successed!")
        
        return res.end()
    },

    addFriends: async (req, res) => {
        var userID = req.query.userID
        var friendID = req.query.friendID
        console.log(userID)

        console.log("addFriends runnned")

        const mysql = require('mysql');
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'uplist'
        });

        connection.connect();
        const sql = `INSERT INTO FriendList(user1,user2) VALUES('${userID}','${friendID}')`
        try{
            await connection.query(sql, function (err, result, fields) {
                if(err){
                    return res.sendStatus(204)
                }else{
                    return res.end()
                }
                console.log("result : ", result)
            })
        }catch(err){
            console.log("error occured!!")

        }

        connection.end();

        console.log("addFriends successed!")

    },

    getFriends:(req,res)=>{
        var friends = []
        var userID = req.query.userID
        const mysql = require('mysql');

        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'uplist'
        });
        connection.connect();

        connection.query(`SELECT users.id,users.profileImgUrl
                            FROM users
                            JOIN (SELECT user2 from FriendList WHERE user1 = '${userID}') AS a
                            ON a.user2 = users.id;`,
                            (error, rows, fields) => {
            if (error) throw error;
            //, rows[i].profileImgUrl
            for (var i in rows) {
                friends.push([rows[i].id, rows[i].profileImgUrl]);
            }
            console.log(friends)
            return res.json(rows)

        });

        connection.end();
        //res.end()
        
    },

    getPosts:(req,res)=>{
        var userID = req.query.userID
        const mysql = require('mysql');

        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'uplist'
        });
        connection.connect();

        connection.query(` 	select a2.profileImgUrl,posts.* from posts join
                            (SELECT users.id,users.profileImgUrl
                            FROM users JOIN(SELECT user2 from FriendList WHERE user1 = '${userID}') AS a
                            on users.id = a.user2) as a2
                            on posts.id = a2.id;`,
                                (error, rows, fields) => {
                if (error) throw error;
                //, rows[i].profileImgUrl
                return res.json(rows)
            });

        connection.end();
    }

};

const process = {

    insertPost:(req,res)=>{
        const response = {};

        console.log("insert post runnned")
        console.log(req.body.id);

        const idRs = req.body.id,
            filenameRs = req.body.filename,
            songnameRs = req.body.songName,
            singerRs = req.body.singerName,
            lyrisRs = req.body.lyris;


        const mysql = require('mysql');

        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'uplist'
        });
        connection.connect();


        const sql = `INSERT INTO posts(id,filename,songname,singer,lyris) VALUES('${idRs}','${filenameRs}','${songnameRs}','${singerRs}','${lyrisRs}')`

        connection.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(result)
        })

        connection.end();

        response.id = idRs;
        response.filename = filenameRs;
        response.success = true;
        response.songName = songnameRs//"남해,경상남도";
        response.albumart = "오늘도 평화로운 남해";
        response.lyris = lyrisRs//"지금은 새벽 1시 20분..나는 API를 짜보고이따....";
        response.singerName = singerRs//"/img/1.jpg"

        console.log("post inserted successed!")

        return res.json(response);

    },


    login: (req, res) => {
        const id = req.body.id,
            password = req.body.password;

        const users = UserStorage.getUsers("id", "password");
        const response = {};

        console.log(id, password);
        console.log(users);

        if (users.id.includes(id)) {
            const idx = users.id.indexOf(id);
            if (users.password[idx] === password) {
                response.success = true;
                response.msg = "login successed";
                return res.json(response);
            }
        }
        response.success = false;
        response.msg = "failed to login";
        return res.json(response);

    },

    load: (req, res) => {
        const response = {};
        const songName = req.body.songName,
            albumart = req.body.albumart,
            lyris = req.body.lyris,
            singerName = req.body.singerName;

        console.log(req.body);

        response.success = true;
        response.songName = "남해,경상남도";
        response.albumart = "오늘도 평화로운 남해";
        response.lyris = "지금은 새벽 1시 20분..나는 API를 짜보고이따....";
        response.singerName = "/img/1.jpg"

        return res.json(response);
    },

};

module.exports = {
    output,
    process,
};