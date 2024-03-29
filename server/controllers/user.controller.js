const User = require("../models/user.model");
const fitnessSchema = require("../models/activity.model");
const verifyToken = require("../config/jwt.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.KEY
require("dotenv").config();
const path = require("path");
const multer = require("multer");
const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/images");
  },
  filename: (req, file, callback) => {
    callback(
      null,
      file.filename + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage, fileFilter: imageFilter }).single("file");


module.exports = {
  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).json({ error: { email: "User not found." } });
      }
      const correctPassword = await bcrypt.compare(req.body.password, user.password);
      if (!correctPassword) {
        return res.status(400).json({ error: { password: "Wrong password." } });
      }
  
      const authToken = jwt.sign({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName
      }, key, { expiresIn: "1d" });
      res.json({ msg: "success!", user: user, token: authToken });
    } catch (error) {
      console.error("Login error:", error);
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: { token: "Token expired. Please log in again." } });
      } else {
        return res.status(500).json({ error: { server: "Internal server error." } });
      }
    }
  },
  register: async (req, res) => {
    try {
        await User.validate(req.body);
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if (req.body.password !== req.body.confirmPassword) {
          return res.status(400).json({ message: 'Password must match confirm password' });
        }
        
        const user = await User.create(req.body);
        res.json({ msg: "success!", user: user });
    } catch (err) {
        console.error(err);
        res.status(400).json(err);
    }
},

  logout: (req, res) => {
    res.clearCookie("authToken");
    res.sendStatus(200);
  },


  uploadProfilePicture: (req, res) => {
    const userId = req.params.id;
    upload(req, res, (err) => {
      if (err) {
        if (err.message === "Only images are allowed") {
          return res.status(400).json({ error: "Only images are allowed" });
        }
        return res.status(400).json({ error: "Invalid file upload" });
      }
      if (!req.file || !req.file.filename) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      User.findByIdAndUpdate(
        userId,
        { profilePic: req.file.filename },
        { new: true }
      )
        .then((updatedUser) => {
          res.status(200).json({
            message: "Profile picture uploaded successfully",
            updatedUser,
          });
        })
        .catch((err) => res.status(400).json(err));
    });
  },

  addLike: async (req, res) => {
    const currentUserId = req.params.id;
    const userId = req.params.userId;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      if (!user.likes) {
        user.likes = [];
      }
      if (!user.likes.includes(currentUserId)) {

        user.likes.push(currentUserId);
      } else {
        return res.status(400).json({ message: "User already liked this profile." });
      }

      await User.updateOne({ _id: user._id }, { likes: user.likes });
      res.json({
        message: "Profile liked successfully.",
        user: user,
      });
    } catch (err) {
      console.error("Error adding a like:", err);
      res.status(500).json({ message: "An error occurred while adding a like to the user profile." });
    }
  },
  
  removeLike: async (req, res) => {
    const currentUserId = req.params.id;
    const userId = req.params.userId;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      const index = user.likes.indexOf(currentUserId);
      if (index === -1) {
        return res.status(400).json({ message: "User has not liked this profile." });
      }
      user.likes.splice(index, 1);

      await User.updateOne({ _id: user._id }, { likes: user.likes });
      res.json({
        message: "Like removed from user profile successfully.",
        user: user,
      });
    } catch (err) {
      console.error("Error removing like:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  },

  getuser: (req, res) => {
    const userId = req.params.id;
    User.findOne({ _id: userId })
      .populate('activities')
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json({ user });
      })
      .catch((err) => res.status(400).json(err));
  },

  //? Read All

  getAllUsers: (req, res) => {
    User.find()
      .populate('activities')
      .then((allUsers) => {
        const usersWithActivities = allUsers.filter(user => user.activities.length > 0);
        res.json(usersWithActivities);
      })
      .catch(err => {
        res.status(500).json({ message: "An error occurred while fetching users", error: err });
      });
  }
  }

