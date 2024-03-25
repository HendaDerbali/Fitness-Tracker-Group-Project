const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const fitnessSchema = require("./activity.model");



const UserSchema = new mongoose.Schema({
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [2, "first name must be at least 2 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      minlength: [2, "last name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: (val) => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be 8 characters or longer"]
    },
    profilePic: {
      type: String,
    },
    bio: {
      type: String,
      minlength: [3, "bio must be at least 3 characters"],
      maxlength: [245, "bio must be less than 245 characters"],
    },
    activities: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'fitness'
}],
  }, {timestamps: true});

UserSchema.virtual('confirmPassword')
.get( () => this._confirmPassword )
.set( value => this._confirmPassword = value );

UserSchema.pre('validate', function(next) {
    if (this.password !== this.confirmPassword) {
      this.invalidate('confirmPassword', 'Password must match confirm password');
    }
    next();
  });

  UserSchema.pre('save', function(next) {
    bcrypt.hash(this.password, 10)
      .then(hash => {
        this.password = hash;
        next();
      });
  });

const User = mongoose.model('User',UserSchema);
module.exports = User;
  
  