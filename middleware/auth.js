const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("token_required");
    }
    try {
        const decoded = jwt.verify(token, 'HEALFYKEY');
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("invalid_token");
    }
    return next();
};

module.exports = verifyToken;