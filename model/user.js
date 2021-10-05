const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    first_name: { type: String, default: null, maxlength: [50, 'too_long_first_name']},
    last_name: { type: String, default: null, maxlength: [50, 'too_long_last_name'] },
    email: { type: String, unique: true, strength: 2, locale: 'en', trim: true, lowercase: true, maxlength: [50, 'too_long_email']  },
    pwd_hash: { type: String },
    phone: { type: String, default: null },
    first_time_logged: { type: Boolean, default: false },
    sms_code: { type: String },
    update_token: { type: String },
    token: { type: String },
    last_login_dt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("user", userSchema);