const Activitycontroller = require("../controllers/activity.controller");
const verifyToken = require("../config/jwt.config");

module.exports=(app)=>{
    // app.get("/activity" ,verifyToken,Activitycontroller.GetAllActivities)
    app.get("/activity/:activityId" ,verifyToken ,Activitycontroller.FindOneActivity)
    app.post("/activity", verifyToken, Activitycontroller.CreateNewActivity)
    app.delete("/activity/:activityId", verifyToken ,Activitycontroller.deleteActivity)
    app.patch("/activity/:activityId/update", verifyToken, Activitycontroller.updateActivity)
}