const UserStorage = require("../../models/UserStorage");

const output = {
     home : (req, res) => {
        res.render("home/index");
        //render는 웹페이지 뿌려주는거인듯
    },
    login : (req, res) => {
        res.render("home/login");
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
};

module.exports = {
    output,
    process,
};