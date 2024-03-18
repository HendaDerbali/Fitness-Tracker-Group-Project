const Activitycontroller=require("../controllers/activity.controller");
const verifyToken = require("../middelwares/userMiddelware");

module.exports=(app)=>{
    app.use(verifyToken)
    app.get("/api/activity",Activitycontroller.GetAllActivitys)
    app.get("/api/activity/:ActivityId", Activitycontroller.FindOneSingleActivity)
    app.put("/api/activity/:ActivityId", Activitycontroller.updateExistingActivity)
    app.post("/api/activity", Activitycontroller.CreateNewActivity)
    app.delete("/api/activity/:ActivityId", Activitycontroller.deleteAnExistingActivity)
}