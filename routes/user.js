const express = require('express');
const router = express.Router();
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require('../config/jwt-config');
const uuid = require('uuid');
const isRegistered = require("../middleware/isRegistered");

router.post('/register', isRegistered, async (req, res) => {
   try {
       if (req.user) {
           res.status(200).json(req.user.email);
       } else {
           const { first_name, last_name, email, pwd, phone } = req.body;

           if (!(email && pwd && first_name && last_name && phone)) {
               res.status(400).send('fill_all_required_form_fields');
           }

           // check if user already exist

           const exists = await User.findOne({ email });
           if (exists) {
               return res.status(409).send("user_exists");
           }

           //Encrypt user password
           const encryptedPassword = await bcrypt.hash(pwd, 10);

           // Create user in our database
           const user = await User.create({
               first_name,
               last_name,
               phone,
               email: email.toLowerCase(), // sanitize: convert email to lowercase
               pwdHash: encryptedPassword,
               updateToken: uuid.v4(),
           });

           // Create token
           const token = jwt.sign(
               { user_id: user._id, email },
               'HEALFYKEY',
               {
                   expiresIn: config.maxAge,
               }
           );
           // save user token
           user.token = token;

           // return new user
           res.status(201).json(user);
       }
   } catch (error) {
       console.log(error);
   }
});

module.exports = router;
