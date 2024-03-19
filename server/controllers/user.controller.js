const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const key = process.env.KEY
require("dotenv").config();

module.exports = {
    login: async(req, res) => {
        const user = await User.findOne({ email: req.body.email });
        if(user === null) {
            return res.sendStatus(400);
        }
        const correctPassword = await bcrypt.compare(req.body.password, user.password);
        if(!correctPassword) {
            return res.sendStatus(400);
        }

        const userToken = jwt.sign({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName
        }, key, {expiresIn:"1d"});
        res.json({ msg: "success!", user: user , token: userToken});
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
    
    logout : (req, res) => {
        res.clearCookie("authToken");
        res.sendStatus(200);
      }
}