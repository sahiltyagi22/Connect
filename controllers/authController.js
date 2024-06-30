let validationToken = process.env.SECRETCODE;

const mongoose = require("mongoose");
const cookie = require("cookie");

const alumniModel = require("./../model/alumniModel");
const studentModel = require("./../model/studentModel");
const jwtValidaton = require("./../utils/tokenValidation");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("./../utils/multer");

// token validation controllers
exports.validationGet = (req, res, next) => {
  try {
    res.render("validation");
  } catch (err) {
    next(err);
  }
};

exports.validationPost = (req, res, next) => {
  try {
    let token = req.body.token;

    if (tokenValidation(token)) {
      return res.render("aluRegis");
    } else {
      // Create a new Error object with a message
      const err = new Error('Invalid Token');
      // Set status code if needed
      err.status = 400; // Bad Request
      // Pass the error to the next middleware
      next(err);
    }
  } catch (err) {
    // If an error occurs outside of the try block, handle it here
    next(err  , {message : "something went wrong"});
  }
};

// alumni registration controller

// exports.alumniRegisterGet = async(req,res,next)=>{
//   res.render('alumniRegistration')
// }

exports.alumniRegisterPost = async (req, res, next) => {
  try {
    // Handle file upload using multer middleware
    upload.single("filename")(req, res,async function (err) {
      if (err) {
        return next(err , {message : "there is an error uploading profile"})
      }

      // Extract other form data from the request body
      const { email, name, password, designation, company, school } = req.body;

      // Get file path of uploaded image
      const profilePicture =   req.file.filename;

      // encrypting the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new alumni instance
      const newAlumni = new alumniModel({
        name: name,
        email: email,
        password: hashedPassword, // Remember to hash password if not already done
        designation: designation,
        company: company,
        school: school,
        profile: profilePicture, // Save image path in alumni database
      });

      // Save alumni to database
      await newAlumni.save();

      const token = jwt.sign(
        { email: newAlumni.email, id: newAlumni._id, role: newAlumni.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.EXPIRES_IN }
      );

      // Set token in cookie
      res.setHeader(
        "Set-Cookie",
        `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${process.env.EXPIRES_IN};`
      );

      res.redirect("/");
    });
  } catch (error) {
    console.log(error);
    res.render('error')
  }
};

// student registration controller
exports.studentRegisterGet = (req, res, next) => {
  try {
    res.render("stuRegis");
  } catch (err) {
    next(err  , {message : 'something went wrong! we are fixing it '});
  }
};

exports.studentRegisterPost = async (req, res, next) => {
  try {
    const { email, name, password, rollno, school } = req.body;

    const studentExists = await studentModel.findOne({ email: email });
    if (studentExists) {
      return next(err , {message : "user already exists."})
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new studentModel({
      name: name,
      email: email,
      password: hashedPassword,
      rollno: rollno,
      school: school,
    });

    await newStudent.save();

    const token = jwt.sign(
      { email: newStudent.email, id: newStudent._id, role: newStudent.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRES_IN }
    );

    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${process.env.EXPIRES_IN};`
    );

    return res.redirect("/");
  } catch (err) {
    res.render('error')
  }
};

// Login controller
exports.loginGet = (req, res) => {
  try {
    if (req.cookies.token) {
      return res.redirect("/");
    }
    res.render("login");
  } catch (err) {
    res.render('error')
  }
};

exports.loginPost = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user;

    // Check if the user is a student
    user = await studentModel.findOne({ email: email });

    // If user is not found as a student, check if they are an alumni
    if (!user) {
      user = await alumniModel.findOne({ email: email });
    }

    // If user is found and password matches, generate token and redirect
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.EXPIRES_IN,
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        expiresIn: process.env.EXPIRES_IN * 1000,
      });
      return res.redirect("/");
    }

    // If no user found or password doesn't match, create a custom error
    alert('Invalid username or password')
    res.redirect('/auth/login')
    
  } catch (err) {
    // Pass the error to the next middleware
    res.render('error')
  }
};


function tokenValidation(token) {
  if(token === validationToken){
    return true
  }else{
    return false
  }
  
}
