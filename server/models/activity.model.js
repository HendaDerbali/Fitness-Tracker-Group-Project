const mongoose = require("mongoose");
const User = require("../models/user.model");


const fitness = new mongoose.Schema(
    {
        Duration: {
            type: Number,
            required: [true, "Duration is required"]
        },
        Distance: {
            type: Number,
            required: [true, "Distance is required"]
        },
        Intensity: {
            required: [true, "Intensity is required"],
            type: String,
            enum: ["Minimal", "Moderate", "Hard"],
            default: "Minimal"
        },
        CaloriesBurned: {
            type: Number,
            required: [true, "Calories Burned is required"]

        },
        ActivityChecked: {
            type: String,
            enum: ["walking", "running", "cycling", "swimming"],
            default: "walking"
        },
        Owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
);


fitness.pre('save', function (next) {
    if (this.ActivityChecked) {
        switch (this.ActivityChecked) {
            case 'walking':
                this.Duration
                this.Intensity
                this.Distance
                break;

            case 'running':
                this.Duration
                this.Intensity
                this.Distance
                break;

            case 'cycling':
                this.Duration
                this.Intensity
                this.Distance
                break;

            case 'swimming':
                this.Duration
                this.Intensity
                this.Distance
                break;
                
            default:
                break;
        }
    }
    next();
});

const fitnessSchema = mongoose.model("fitness", fitness);
module.exports = fitnessSchema;