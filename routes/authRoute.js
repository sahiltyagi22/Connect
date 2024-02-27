require("dotenv").config();

const express = require("express");
const router = express.Router();
const auth = require('./../controllers/authController')
const {loginValidation} = require('./../utils/loginValidation')



router.use('/validation', loginValidation)

// alumni validation (to registration route) route
router
  .route("/validation")
  .get(auth.validationGet)
  .post(auth.validationPost);

// alumni registration route
router
  .route("/auth/alumni")
  // .get(auth.alumniRegisterGet)
  .post(auth.alumniRegisterPost);

// student registration route
router
  .route("/auth/student")
  .get(auth.studentRegisterGet)
  .post(auth.studentRegisterPost);


// login route
router
  .route("/auth/login")
  .get(auth.loginGet)
  .post(auth.loginPost);

// logout 

router.route('/auth/logout')
.get((req,res)=>{
  res.clearCookie('token');
    
    // Redirect the user to the login page or homepage
    res.redirect('/');
})

module.exports = router;
