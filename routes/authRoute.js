require("dotenv").config();

const express = require("express");
const router = express.Router();
const auth = require('./../controllers/authController')



// alumni validation (to registration route) route
router
  .route("/validation")
  .get(auth.validationGet)
  .post(auth.validationPost);

// alumni registration route
router
  .route("/auth/alumni")
  .get(auth.alumniRegisterGet)
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

module.exports = router;