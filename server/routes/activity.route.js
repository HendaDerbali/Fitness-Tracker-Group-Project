const Activitycontroller = require("../controllers/activity.controller");
const verifyToken = require("../middelwares/userMiddelware");

module.exports=(app)=>{
    // app.get("/activity" ,verifyToken,Activitycontroller.GetAllActivitys)
    app.get("/activity/:ActivityId" ,verifyToken ,Activitycontroller.FindOneSingleActivity)
    app.put("/activity/:ActivityId" ,verifyToken ,Activitycontroller.updateExistingActivity)
    app.post("/activity", verifyToken, Activitycontroller.CreateNewActivity)
    app.delete("/activity/:ActivityId", verifyToken ,Activitycontroller.deleteAnExistingActivity)
}