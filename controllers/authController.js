let validationToken = "12345";

const mongoose = require('mongoose')
const cookie = require('cookie');


const alumniModel = require('./../model/alumniModel')
const studentModel = require("./../model/studentModel");
const jwtValidaton = require('./../utils/tokenValidation')


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require('./../utils/multer')


// token validation controllers
exports.validationGet = (req, res, next) => {

   res.render('validation')

};

exports.validationPost = (req, res, next) => {
  let token = req.body.token;

  if (tokenValidation(token)) {
    return res.render('aluRegis')
  }
};

// alumni registration controller

// exports.alumniRegisterGet = async(req,res,next)=>{
//   res.render('alumniRegistration')
// }

exports.alumniRegisterPost = async (req, res, next) => {
  try {
    // Handle file upload using multer middleware
    upload.single('profilePicture')(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ error: 'Error uploading profile picture' });
      }

      // Extract other form data from the request body
      const { email, name, password, designation, company, school } = req.body;

      // Get file path of uploaded image
      const profilePicture = req.file.filename;

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
        profile: profilePicture // Save image path in alumni database
      });

      // Save alumni to database
      await newAlumni.save();

      const token = jwt.sign(
        { email: newAlumni.email, id: newAlumni._id, role: newAlumni.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.EXPIRES_IN }
      );

      // Set token in cookie
      res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${process.env.EXPIRES_IN};`);

      res.redirect('/')
    });
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
};

// student registration controller
exports.studentRegisterGet = (req, res, next) => {
  res.render('stuRegis')
};

exports.studentRegisterPost = async (req, res, next) => {
  const { email, name, password, rollno, school, year } = req.body;

  const studentExists = await studentModel.findOne({ email: email });
  if (studentExists) {
    return res.send("user already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newStudent = new studentModel({
    name: name,
    email: email,
    password: hashedPassword,
    rollno: rollno,
    school: school,
    year: year,
  });

  await newStudent.save();

  const token = jwt.sign(
    { email: newStudent.email, id: newStudent._id, role: newStudent.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.EXPIRES_IN }
  );

  res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${process.env.EXPIRES_IN};`);

  return res.redirect('/')
};


// Login controller
exports.loginGet = (req,res)=>{
  if(req.cookies.token){
    return res.redirect('/')
  }
    res.render('login')
}

exports.loginPost = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);

  try {
      let user;

      // Check if the user is a student
      user = await studentModel.findOne({ email: email });

      // If user is not found as a student, check if they are an alumni
      if (!user) {
          user = await alumniModel.findOne({ email: email });
      }



      // If user is found and password matches, generate token and redirect
      if (user && bcrypt.compareSync(password, user.password)) {
          const token = jwt.sign({ email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, {
              expiresIn: process.env.EXPIRES_IN,
          });
          res.cookie('token', token, { httpOnly: true, sameSite: 'strict', expiresIn: process.env.EXPIRES_IN * 1000 });
          return res.redirect('/');
      }

      // If no user found or password doesn't match, return invalid credentials
      return res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
};







function tokenValidation(token) {
  if (token === validationToken) {
    return true;
  } else {
    res.redirect("/");
  }
}
