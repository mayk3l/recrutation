const express = require('express');
const router = express.Router();
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const sendSms = require("../utils/sms-provider");

router.post('/login', async (req, res) => {
    try {
        const { email, pwd } = req.body;

        if (!(email && pwd)) {
            res.status(400).send('fill_all_required_form_fields');
        }
        let user = await User.findOne({ email });
        if (user && (await bcrypt.compare(pwd, user.pwd_hash))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.JWT_KEY,
                {
                    expiresIn: process.env.JWT_AGE,
                }
            );

            if (user.first_time_logged) {
                //TODO sms provider didnt accept sender field
/*
                await sendSms.sendConfirmationSms(user.phone, user.sms_code);
*/
            }

            // saving first time loggin so I can ask for SMS if this value is set to true
            const digits = (new Array(9)).fill(null).map((e, i) => i + 1);
            const generatedCode = (new Array(4)).fill(null).map(() => digits[~~(Math.random() * digits.length)]).join('');
            user.first_time_logged = true;

            //TODO add generated code but for task I add 1234 here
            user.sms_code = 1234;
            await user.save();


            // add user token
            user.token = token;

            //deleting sensitive data as password, shouldn't be returned to frontend
            const userObj = user.toObject();
            delete userObj.pwd_hash;

            res.status(200).json(userObj);
        }
        res.status(401).send("wrong_credentials");
    } catch (error) {

    }
});

router.post('/logout', auth, async (req, res) => {
    res.status(200).json({logout: 'logout'});
});

router.put('/sms-verify/:id', async (req, res) => {
    //TODO get single user by id instead of all users in DB

   const users = await User.find();
   for (const u of users) {
       if (req.body.smsCode !== u.sms_code) {
           res.status(400).send("wrong_code");
       }
   }
    const token = jwt.sign(
        { user_id: user._id, email },
        process.env.JWT_KEY,
        {
            expiresIn: process.env.JWT_AGE,
        }
    );
   users[0].token = token;
   const userObj = user.toObject();
   delete userObj.pwd_hash;
   res.status(200).json(userObj);
});

module.exports = router;
