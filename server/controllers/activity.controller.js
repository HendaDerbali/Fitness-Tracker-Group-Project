const fitnessSchema = require("../models/activity.model");
const verifyToken = require("../middelwares/userMiddelware");
const User = require("../models/user.model");



module.exports.CreateNewActivity = async (req, res) => {
    verifyToken(req, res, async () => {
        try {
            const user = req.user;
            const addedByUser = await User.findById(user.id);
            const newActivity = new fitnessSchema({
                Duration: req.body.Duration,
                Distance: req.body.Distance,
                Intensity: req.body.Intensity,
                CaloriesBurned: req.body.CaloriesBurned,
                ActivityChecked: req.body.ActivityChecked,
                Owner: user.id
            });
            const savedActivity = await newActivity.save();
            if (addedByUser) {
                await User.findByIdAndUpdate(user.id, { $push: { activities: savedActivity._id } });
            }

            console.log(savedActivity);
            res.json({ newActivity: savedActivity });
        } catch(err) {
            res.status(400).json(err);
        }
    });
};

module.exports.updateActivity = (req, res) => {
    const updatedFields = {
      Duration: req.body.Duration,
      Distance: req.body.Distance,
      Intensity: req.body.Intensity,
      CaloriesBurned: req.body.CaloriesBurned,
      ActivityChecked: req.body.ActivityChecked,
      Owner: req.body.Owner,
    };
  
    fitnessSchema.findOneAndUpdate(
      { _id: req.params.activityId }, // Correct parameter name
      updatedFields,
      { new: true, runValidators: true }
    )
    .then((updatedActivity) => {
      if (!updatedActivity) {
        return res.status(404).json({ error: 'Activity not found' });
      }
      res.json({ updatedActivity });
    })
    .catch((err) => res.status(400).json(err));
  };

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

module.exports.FindOneSingleActivity = (req, res) => {
    fitnessSchema.findOne({ _id: req.params.id })
        .then(oneSingleActivity => {
            res.json(oneSingleActivity)
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports.deleteAnExistingActivity = (req, res) => {
    fitnessSchema.deleteOne({ _id: req.params.ActivityId })
        .then(result => {
            res.json(result)
        })
        .catch((err) => {
            res.json(err)
        })
}

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



    