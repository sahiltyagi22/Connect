const jwt = require('jsonwebtoken')

exports.loginValidation = function (req, res, next) {
    const token = req.header('Authorization');

    if (!token) {
        return next(); // Continue to the next middleware if no token is provided
    }else{
        return res.redirect('/')
    }
   next()
};