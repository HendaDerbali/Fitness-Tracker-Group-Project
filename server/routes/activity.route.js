const Activitycontroller = require("../controllers/activity.controller");
const verifyToken = require("../middelwares/userMiddelware");

module.exports=(app)=>{
    app.get("http://localhost:5000/activity" ,verifyToken,Activitycontroller.GetAllActivitys)
    app.get("http://localhost:5000/activity/:ActivityId" ,verifyToken ,Activitycontroller.FindOneSingleActivity)
    app.put("http://localhost:5000/activity/:ActivityId" ,verifyToken ,Activitycontroller.updateExistingActivity)
    app.post("http://localhost:5000/activity", verifyToken, Activitycontroller.CreateNewActivity)
    app.delete("http://localhost:5000/activity/:ActivityId", verifyToken ,Activitycontroller.deleteAnExistingActivity)
}