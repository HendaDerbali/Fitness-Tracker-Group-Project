const Activitycontroller=require("../controllers/activity.controller");
const verifyToken = require("../middelwares/userMiddelware");

module.exports=(app)=>{
    app.use(verifyToken)
    app.get("/api/activity",Activitycontroller.GetAllActivitys)
    app.get("/api/activity/:activityId", Activitycontroller.FindOneSingleActivity)
    app.put("/api/activity/:activityId", Activitycontroller.updateExistingActivity)
    app.post("/api/activity", Activitycontroller.CreateNewActivity)
    app.delete("/api/activity/:activityId", Activitycontroller.deleteAnExistingActivity)
}