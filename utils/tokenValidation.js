const jwt = require('jsonwebtoken')
const cookie = require('cookie')

exports.tokenValidation = function (req, res, next) {
    const token = req.headers.authorization || req.cookies.token;
    if (!token) {
      return res.redirect('/auth/login')
    }
  
    // Verify token and decode its payload
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ error: 'Forbidden: Invalid token' });
      }
      // Attach decoded token payload to the request object
      req.user = decodedToken;
      next();
    });
};