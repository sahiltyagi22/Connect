let validationToken = "12345";

const mongoose = require('mongoose')

const alumniModel = require('./../model/alumniModel')
const studentModel = require("./../model/studentModel");
const jwtValidaton = require('./../utils/tokenValidation')


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require('./../utils/multer')


// token validation controllers
exports.validationGet = (req, res, next) => {

   res.send('here you will get validation input box')

};

exports.validationPost = (req, res, next) => {
  let token = req.body.token;

  if (tokenValidation(token)) {
    return res.render('alumniRegistration')
  }
};

// alumni registration controller

exports.alumniRegisterGet = async(req,res,next)=>{
  res.render('alumniRegistration')
}

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
      const profilePicture = req.file.filename

      console.log(profilePicture);

      // Create a new alumni instance
      const newAlumni = new alumniModel({
        name: name,
        email: email,
        password: password, // Remember to hash password if not already done
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
  
      res.status(201).json({ token , newAlumni});
    });
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
  
  }


// student registration controller
exports.studentRegisterGet = (req, res, next) => {
  res.render('studentRegistration')
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

  res.status(201).json({ token });
};


// Login controller
exports.loginGet = (req,res)=>{
    res.send("this is the login route");
}

exports.loginPost = async(req,res,next)=>{
    const { email, password } = req.body;
    console.log(email);
    console.log(password);
    try {
      const student = await studentModel.findOne({ email:email });

      if (student && bcrypt.compareSync(password, student.password)) {
        const token = jwt.sign({ email: student.email , id:student._id, role:student.role }, process.env.JWT_SECRET, {
          expiresIn:  process.env.EXPIRES_IN,
        });
        return res.status(200).json({ token });
      }

      const alumni = await alumniModel.findOne({ email:email });

      if (alumni && bcrypt.compareSync(password, alumni.password)) {
        const token = jwt.sign({ email: alumni.email , id:alumni._id, role:alumni.role },  process.env.JWT_SECRET, {
          expiresIn:  process.env.EXPIRES_IN,
        });
        return res.status(200).json({ token });
      }

      return res.status(401).json({ error: "Invalid credentials" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
}







function tokenValidation(token) {
  if (token === validationToken) {
    return true;
  } else {
    res.redirect("/");
  }
}
