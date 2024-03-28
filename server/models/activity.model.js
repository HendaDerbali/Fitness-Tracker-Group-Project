const mongoose = require("mongoose");
const User = require("../models/user.model");


const fitness = new mongoose.Schema(
    {
        Duration: {
            type: Number,
            required: [true, "Duration is required"],
            min: [1, "Duration must be at least 1 minute"]
        },
        Distance: {
            type: Number,
            required: [true, "Distance is required"],
            min: [1, "Distance must be at least 1 meter"]
        },
        Intensity: {
            required: [true, "Intensity is required"],
            type: String,
            enum: ["Minimal", "Moderate", "Hard"],
            default: "Minimal"
        },
        Weight: {
            type: Number,
            required: [true, "Weight is required"],
            min: [1, "Weight must be at least 1 kg"]
        },
        Height: {
            type: Number,
            required: [true, "Height is required"],
            min: [1, "Height must be at least 1 cm"]
        },
        Gender: {
            type: String,
            required: [true, "Gender is required"],
            enum: ["Male", "Female"] //this will be moved to the user model later
        },
        Age: {
            type: Number,
            required: [true, "Age is required"],
            min: [1, "Age must be at least 1 year"]
        },
        CaloriesBurned: {
            type: Number,
            default: 0
        },
        ActivityChecked: {
            type: String,
            enum: ["walking", "running", "cycling", "swimming"],
            default: "walking"
        },
        Owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    },
    { timestamps: true }
);


fitness.pre('save', function (next) {
    if (this.ActivityChecked) {
        switch (this.ActivityChecked) {
            case 'walking':
                this.CaloriesBurned = calculateWalkingCalories(this.Duration, this.Intensity, this.Distance, this.Weight, this.Height, this.Gender, this.Age);
                break;

            case 'running':
                this.CaloriesBurned = calculateRunningCalories(this.Duration, this.Intensity, this.Distance, this.Weight, this.Height, this.Gender, this.Age);
                break;

            case 'cycling':
                this.CaloriesBurned = calculateCyclingCalories(this.Duration, this.Intensity, this.Distance, this.Weight, this.Height, this.Gender, this.Age);
                break;

            case 'swimming':
                this.CaloriesBurned = calculateSwimmingCalories(this.Duration, this.Intensity, this.Distance, this.Weight, this.Height, this.Gender, this.Age);
                break;
                
            default:
                break;
        }
        this.CaloriesBurned = +this.CaloriesBurned.toFixed(3);
    }
    next();
});

const calculateBMR = (Weight, Height, Gender, Age) => {
    let BMR = 0;
    if (Gender === 'Male') {
        BMR = 10 * Weight + 6.25 * Height - 5 * Age + 5;
    } else if (Gender === 'Female') {
        BMR = 10 * Weight + 6.25 * Height - 5 * Age - 161;
    }
    return BMR;
};

const calculateWalkingCalories = (Duration, Intensity, Distance, Weight, Height, Gender, Age) => {
    let MET = 3.8;
    if (Intensity === 'Moderate') {
        MET *= 1.5;
    } else if (Intensity === 'Hard') {
        MET *= 2.0;
    }
    const durationHours = Duration / 60;
    const BMR = calculateBMR(Weight, Height, Gender, Age);
    const CaloriesBurned = (MET * Weight * durationHours + BMR) * (Distance / 1000);
    return CaloriesBurned;
};

const calculateRunningCalories = (Duration, Intensity, Distance, Weight, Height, Gender, Age) => {
    let MET = 8.0;
    if (Intensity === 'Moderate') {
        MET *= 1.5;
    } else if (Intensity === 'Hard') {
        MET *= 2.0;
    }
    const durationHours = Duration / 60;
    const BMR = calculateBMR(Weight, Height, Gender, Age);
    const CaloriesBurned = (MET * Weight * durationHours + BMR) * (Distance / 1000);
    return CaloriesBurned;
};

const calculateCyclingCalories = (Duration, Intensity, Distance, Weight, Height, Gender, Age) => {
    let MET = 6.0;
    if (Intensity === 'Moderate') {
        MET *= 1.5;
    } else if (Intensity === 'Hard') {
        MET *= 2.0;
    }
    const durationHours = Duration / 60;
    const BMR = calculateBMR(Weight, Height, Gender, Age);
    const CaloriesBurned = (MET * Weight * durationHours + BMR) * (Distance / 1000);
    return CaloriesBurned;
};

const calculateSwimmingCalories = (Duration, Intensity, Distance, Weight, Height, Gender, Age) => {
    let MET = 7.0;
    if (Intensity === 'Moderate') {
        MET *= 1.5;
    } else if (Intensity === 'Hard') {
        MET *= 2.0;
    }
    const durationHours = Duration / 60;
    const BMR = calculateBMR(Weight, Height, Gender, Age);
    const CaloriesBurned = (MET * Weight * durationHours + BMR) * (Distance / 1000);
    return CaloriesBurned;
};

const fitnessSchema = mongoose.model("fitness", fitness);
module.exports = { fitnessSchema, calculateWalkingCalories, calculateRunningCalories, calculateCyclingCalories, calculateSwimmingCalories };