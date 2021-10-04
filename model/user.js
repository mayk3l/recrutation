const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null, maxlength: [50, 'too_long_first_name']},
    last_name: { type: String, default: null, maxlength: [50, 'too_long_last_name'] },
    email: { type: String, unique: true, strength: 2, locale: 'en', trim: true, lowercase: true, maxlength: [50, 'too_long_email']  },
    pwdHash: { type: String },
    updateToken: { type: String },
    token: { type: String },
    last_login_dt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("user", userSchema);