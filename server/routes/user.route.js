const userController = require("../controllers/user.controller");

module.exports=(app)=>{
    app.post('/user/register',userController.register);
    app.post('/user/login',userController.login);
    app.post ('/user/logout',userController.logout);
}