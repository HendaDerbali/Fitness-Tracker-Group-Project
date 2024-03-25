const Activitycontroller = require("../controllers/activity.controller");
const verifyToken = require("../middelwares/userMiddelware");

module.exports=(app)=>{
    // app.get("/activity" ,verifyToken,Activitycontroller.GetAllActivitys)
    app.get("/activity/:activityId" ,verifyToken ,Activitycontroller.FindOneSingleActivity)
    app.put("/activity/:activityId" ,verifyToken ,Activitycontroller.updateExistingActivity)
    app.post("/activity", verifyToken, Activitycontroller.CreateNewActivity)
    app.delete("/activity/:activityId", verifyToken ,Activitycontroller.deleteAnExistingActivity)
    app.patch("/activity/:activityId/update", verifyToken, Activitycontroller.updateActivity)
}