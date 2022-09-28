const UserStorage = require("../../models/UserStorage");

const output = {
     home : (req, res) => {
        res.render("home/index");
        //render는 웹페이지 뿌려주는거인듯
    },
    login : (req, res) => {
        res.render("home/login");
    },
    portfolio: (req, res) => {
        res.render("home/portfolio");
    },
    img : (req,res)=>{
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
}
};



const process = {
    login : (req,res) => {
        const id = req.body.id,
              password = req.body.password;
        
        const users = UserStorage.getUsers("id","password");
        const response = {};

        console.log(id,password);
        console.log(users);

        if(users.id.includes(id)){
            const idx = users.id.indexOf(id);
            if(users.password[idx]===password){
                response.success = true;
                response.msg = "login successed";
                return res.json(response);
            }
        }
        response.success = false;
        response.msg = "failed to login";
        return res.json(response);
        
    },

    load : (req,res) => {
        const response = {};

        response.success=true;
        response.location = "남해,경상남도";
        response.subject = "오늘도 평화로운 남해";
        response.comment = "지금은 새벽 1시 20분..나는 API를 짜보고이따....";
        response.img_add = "/img/1.jpg"
        return res.json(response);
    },
    
};

module.exports = {
    output,
    process,
};