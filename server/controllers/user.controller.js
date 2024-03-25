const User = require("../models/user.model");
const fitnessSchema = require("../models/activity.model");

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
    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
      return res.sendStatus(400);
    }
    const correctPassword = await bcrypt.compare(req.body.password, user.password);
    if (!correctPassword) {
      return res.sendStatus(400);
    }

    const userToken = jwt.sign({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName
    }, key, { expiresIn: "1d" });
    res.json({ msg: "success!", user: user, token: userToken });
  },
  register: (req, res) => {
    User.findOne({ email: req.body.email })
      .then(existingUser => {
        if (existingUser) {
          return res.status(400).json({ message: 'Email already exists' });
        }

        User.create(req.body)
          .then(user => {
            res.json({ msg: "success!", user: user });
          })
          .catch(err => res.json(err));
      })
      .catch(err => res.json(err));
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

  getuser: (req, res) => {
    const userId = req.params.id;
    User.findOne({ _id: userId })
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

