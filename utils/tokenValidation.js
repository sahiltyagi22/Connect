const jwt = require('jsonwebtoken')

exports.tokenValidation = function (req, res, next) {
    const token = req.header('Authorization');


    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token Verification Error:', err);
            return res.status(403).json({ error: 'Forbidden: Invalid token' });
        }

        req.user = user;
        next();
    });
};