const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = process.env.key
require("dotenv").config();

module.exports = {
    login: async(req, res) => {
        const user = await User.findOne({ email: req.body.email });
     
        if(user === null) {
            // email not found in users collection
            return res.sendStatus(400);
        }
     
        // if we made it this far, we found a user with this email address
        // let's compare the supplied password to the hashed password in the database
        const correctPassword = await bcrypt.compare(req.body.password, user.password);
     
        if(!correctPassword) {
            // password wasn't a match!
            return res.sendStatus(400);
        }
     
        // if we made it this far, the password was correct
        const userToken = jwt.sign({
            id: user._id
        }, process.env.key,{expiresIn:"1d"});
     
        // note that the response object allows chained calls to cookie and json
        res.json({ msg: "success!", user: user ,token:userToken});
           
    },
    register: (req, res) => {
        User.create(req.body)
          .then(user => {
              const userToken = jwt.sign({
                  id: user._id
              }, process.env.key);
       
           
                res  .json({ msg: "success!", user: user ,token:userToken});
          })
          .catch(err => res.json(err));
      }


}