const output = {
     home : (req, res) => {
        res.render("home/index");
        //render는 웹페이지 뿌려주는거인듯
    },
    login : (req, res) => {
        res.render("home/login");
    }
};

const users = {
    id : ["admin","guest",],
    password : ["admin","",],
}

const process = {
    login : (req,res) => {
        const id = req.body.id,
              password = req.body.password;

        console.log(id,password);

        if(users.id.includes(id)){
            const idx = users.id.indexOf(id);
            if(users.password[idx]===password){
                return res.json({
                    success: true,
                });
            }
        }return res.json({
        success: false,
        msg:"failed to login",
        });
        
    },
};

module.exports = {
    output,
    process,
};