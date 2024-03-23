const fitnessSchema = require("../models/activity.model");
const verifyToken = require("../middelwares/userMiddelware");
const User = require("../models/user.model");
const { log } = require("console");

//create new Activity 
module.exports.CreateNewActivity = async (req, res) => {
    // Use the verifyToken middleware to protect this route
    verifyToken(req, res, async () => {
      try {
        // Access the user from req.user (provided by verifyToken)
        const user = req.user;
  
        // Fetch the user's full name
        const addedByUser = await User.findById(user.id);
  
        // Create a new Activity with the user information
        const newActivity = new fitnessSchema({
          Duration: req.body.Duration,
          Distance: req.body.Distance,
          Intensity: req.body.Intensity,
          CaloriesBurned: req.body.CaloriesBurned,
          ActivityChecked: req.body.ActivityChecked,
          
        });
  
        // Save the new Activity
        const savedActivity = await newActivity.save();
  
        // Update the user's favorites by adding the new Activity's ID
        if (user) {
          await User.findByIdAndUpdate(user.id, { $addToSet: { favorites: savedActivity._id } });
        }
  
        console.log(savedActivity);
        res.json({ newActivity: savedActivity });
      } catch(err) {
        res.status(400).json(err);
  }; 
    });
  };
//read all 
module.exports.GetAllActivitys = (req, res) => {
 
    fitnessSchema.find()
    .then((allfitness)=>{
        console.log(allfitness)
        res.json(allfitness)
    })
    .catch(err=>{
        res.json({message:"wait a min",err})
    })
}

//Read One

module.exports.FindOneSingleActivity = (req, res) => {
    fitnessSchema.findOne({ _id: req.params.ActivityId })
        .then(oneSingleActivity => {
            res.json(oneSingleActivity)
        })
        .catch((err) => {
            res.json(err)
        })
}

//DELETE

module.exports.deleteAnExistingActivity = (req, res) => {
    fitnessSchema.deleteOne({ _id: req.params.ActivityId })
        .then(result => {
            res.json(result)
        })
        .catch((err) => {
            res.json(err)
        })
}

//UPDATE

module.exports.updateExistingActivity = async (req, res) => {
    try {
        const updatedActivity = await fitnessSchema.findOneAndUpdate(
            { _id: req.params.ActivityId },
            req.body,
            { new: true, runValidators: true }
        );

        res.json({ done: true, updatedActivity });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



    