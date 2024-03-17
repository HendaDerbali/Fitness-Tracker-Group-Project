const mongoose = require("mongoose");

const fitness = new mongoose.Schema(
    {
        Duration:{
            type:Number,
            required:[true,"Duration is required"]
        },
        Distance:{
            type:Number,
            required:[true,"Distance is required"],

        },
        Intensity: {
            required:[true,"Intensity is required"],
            type: String,
        },
        CaloriesBurned: {
            type:Number,
        },
        ActivityChecked: {
            type: String,
            enum: ["walking", "running", "cycling", "swimming"],
            default : null
        } ,
        likes: {
            type:Number,
            default :0,
            type: mongoose.Schema.Types.ObjectId,
            ref :"User"
        } 
    },{timestamps:true}
);


const fitnessSchema = mongoose.model("fitnessSchema",fitness)
module.exports = fitnessSchema;
