const mongoose = require("mongoose");

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
    },
    { timestamps: true }
);

// Define a pre-save hook to set duration, intensity, and distance based on the selected activity
fitness.pre('save', function (next) {
    // Only calculate if ActivityChecked is set
    if (this.ActivityChecked) {
        switch (this.ActivityChecked) {
            case 'walking':
                // Set duration, intensity, and distance for walking
                // For example:
                this.Duration
                this.Intensity
                this.Distance
                break;
            case 'running':
                // Set duration, intensity, and distance for running
                // For example:
                this.Duration
                this.Intensity
                this.Distance
                break;
            //
            case 'cycling':
                // Set duration, intensity, and distance for running
                // For example:
                this.Duration
                this.Intensity
                this.Distance
                break;

            case 'swimming':
                // Set duration, intensity, and distance for running
                // For example:
                this.Duration
                this.Intensity
                this.Distance
                break;
            // Add cases for other activities
            default:
                // Handle default case or invalid activity
                break;
        }
    }
    next();
});

const fitnessSchema = mongoose.model("Fitness", fitness);
module.exports = fitnessSchema;