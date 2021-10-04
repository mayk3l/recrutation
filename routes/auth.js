const express = require('express');
const router = express.Router();
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require('../config/jwt-config');
const auth = require("../middleware/auth");

router.post('/login', async (req, res) => {
    try {
        const { email, pwd } = req.body;

        if (!(email && pwd)) {
            res.status(400).send('fill_all_required_form_fields');
        }
        let user = await User.findOne({ email });
        if (user && (await bcrypt.compare(pwd, user.pwdHash))) {
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

            //deleting sensitive data as password, shouldn't be returned to frontend
            const userObj = user.toObject();
            delete userObj.pwdHash;

            res.status(200).json(userObj);
        }
        res.status(400).send("wrong_credentials");
    } catch (error) {

    }
});

router.post('/logout', auth, async (req, res) => {
    res.status(200).json({logout: 'logout'});
});

module.exports = router;
