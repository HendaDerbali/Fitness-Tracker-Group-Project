const { fitnessSchema } = require("../models/activity.model");
const { calculateWalkingCalories, calculateRunningCalories, calculateCyclingCalories, calculateSwimmingCalories } = require("../models/activity.model");
const verifyToken = require("../config/jwt.config");
const User = require("../models/user.model");



module.exports.CreateNewActivity = async (req, res) => {
    verifyToken(req, res, async () => {
        try {
            const user = req.user;
            const newActivity = new fitnessSchema({
                Duration: req.body.Duration,
                Distance: req.body.Distance,
                Intensity: req.body.Intensity,
                Weight: req.body.Weight,
                Height: req.body.Height,
                Age: req.body.Age,
                Gender: req.body.Gender,
                ActivityChecked: req.body.ActivityChecked,
                Owner: user.id
            });

            const savedActivity = await newActivity.save();
            await User.findByIdAndUpdate(user.id, { $push: { activities: savedActivity._id } });
            await User.findByIdAndUpdate(user.id, { $inc: { caloriesSum: savedActivity.CaloriesBurned } });

            console.log(savedActivity);
            res.json({ newActivity: savedActivity });
        } catch(err) {
            res.status(400).json(err);
        }
    });
};

module.exports.updateActivity = async (req, res) => {
    verifyToken(req, res, async () => {
        try {
            const activityId = req.params.activityId;
            const updatedFields = req.body;
            const existingActivity = await fitnessSchema.findById(activityId);
            if (!existingActivity) {
                return res.status(404).json({ message: 'Activity not found' });
            }
            const oldCaloriesBurned = existingActivity.CaloriesBurned;
            let newCaloriesBurned = oldCaloriesBurned;

            if (updatedFields.Duration || updatedFields.Distance || updatedFields.Intensity || updatedFields.Weight || updatedFields.Height || updatedFields.Age || updatedFields.Gender || updatedFields.ActivityChecked) {
                const { Duration, Distance, Intensity, Weight, Height, Age, Gender, ActivityChecked } = { ...existingActivity._doc, ...updatedFields };
                
                switch (ActivityChecked) {
                    case 'walking':
                        newCaloriesBurned = calculateWalkingCalories(Duration, Intensity, Distance, Weight, Height, Gender, Age);
                        break;
                    case 'running':
                        newCaloriesBurned = calculateRunningCalories(Duration, Intensity, Distance, Weight, Height, Gender, Age);
                        break;
                    case 'cycling':
                        newCaloriesBurned = calculateCyclingCalories(Duration, Intensity, Distance, Weight, Height, Gender, Age);
                        break;
                    case 'swimming':
                        newCaloriesBurned = calculateSwimmingCalories(Duration, Intensity, Distance, Weight, Height, Gender, Age);
                        break;
                    default:
                        break;
                }
            }
            existingActivity.set({ ...updatedFields, CaloriesBurned: newCaloriesBurned });
            const validationResult = existingActivity.validateSync();
            if (validationResult) {
                const errors = Object.keys(validationResult.errors).map(key => ({
                    field: key,
                    message: validationResult.errors[key].message
                }));
                return res.status(400).json({ errors });
            }
            const updatedActivity = await existingActivity.save();
            const user = await User.findByIdAndUpdate(updatedActivity.Owner);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const caloriesDiff = newCaloriesBurned - oldCaloriesBurned;
            user.caloriesSum += caloriesDiff;
            await user.save();
            res.json({ updatedActivity, user });
        } catch(err) {
            res.status(400).json({ message: err.message });
        }
    });
};

module.exports.GetAllActivities = (req, res) => {
 
    fitnessSchema.find()
    .then((allfitness)=>{
        console.log(allfitness)
        res.json(allfitness)
    })
    .catch(err=>{
        res.json({message:"wait a min",err})
    })
}

module.exports.FindOneActivity = (req, res) => {
    fitnessSchema.findOne({ _id: req.params.activityId })
        .then(oneSingleActivity => {
            res.json(oneSingleActivity)
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports.deleteActivity = async (req, res) => {
    verifyToken(req, res, async () => {
        try {
            User.schema.set('validateBeforeSave', false);

            const activityId = req.params.activityId;
            const deletedActivity = await fitnessSchema.findById(activityId);
            if (!deletedActivity) {
                return res.status(404).json({ message: 'Activity not found' });
            }
            const user = await User.findById(deletedActivity.Owner);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            let caloriesDiff = -deletedActivity.CaloriesBurned;
            user.caloriesSum += caloriesDiff;
            if (user.caloriesSum < 0) {
                user.caloriesSum = 0;
            }
            await user.save();
            await User.findByIdAndUpdate(user._id, { $pull: { activities: activityId } });
            await fitnessSchema.findByIdAndDelete(activityId);

            User.schema.set('validateBeforeSave', true);

            res.json({ message: 'Activity deleted successfully' });
        } catch (error) {
            console.error('Delete error:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });
};

    