const userController = require("../controllers/user.controller");
const verifyToken = require("../middelwares/userMiddelware");

module.exports=(app)=>{
    app.post('/user/register',userController.register);
    app.post('/user/login',userController.login);
    app.post ('/user/logout',userController.logout);
    app.patch('/user/profile/:id/image', verifyToken, userController.uploadProfilePicture)
    app.get('/user/:id', verifyToken ,userController.getuser)
}