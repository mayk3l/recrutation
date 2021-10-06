const express = require('express');
const router = express.Router();
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

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
                const message = `Aktywuj logowanie: ${smsCode}`;
                const urlParameters = querystring.stringify(
                    {
                        key: process.env.SMS_KEY,
                        clear_polish: 1,
                        password: process.env.SMS_PASS,
                        from: 'TEST',
                        to: phoneNumber instanceof Array ? phoneNumber : [phoneNumber],
                        msg: message,
                        test: 1,
                    },
                    null,
                    null,
                    { encodeURIComponent: encodeURI },
                );

                const response = await fetch(process.env.SMS_URL, {
                    method: 'POST',
                    body: urlParameters,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });

                console.log(response);

                const responseMessage = JSON.parse(await response.text());

                console.log(responseMessage);
                if (
                    responseMessage.errorCode) {
                    if (responseMessage.errorCode === 106) {
                        throw new Error('Sms provider does not accept phone number');
                    }
                    throw new Error('Unexpected error');
                }
            }

            // saving first time loggin so I can ask for SMS if this value is set to true
            const digits = (new Array(9)).fill(null).map((e, i) => i + 1);
            const generatedCode = (new Array(4)).fill(null).map(() => digits[~~(Math.random() * digits.length)]).join('');
            user.first_time_logged = true;
            user.sms_code = generatedCode;
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
   const user = await User.findOne({_id: req.params._id});
   if (req.body.smsCode !== user.sms_code) {
       res.status(400).send("wrong_code");
   }
   res.status(200).send("code_verified");
});

module.exports = router;
