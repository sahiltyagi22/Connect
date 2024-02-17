let validationToken = "12345";

const mongoose = require('mongoose')

const alumniModel = require('./../model/alumniModel')
const studentModel = require("./../model/studentModel");
const jwtValidaton = require('./../utils/tokenValidation')

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

exports.alumniRegisterPost = async (req, res, next) => {
  const { email, name, password, designation, company, school } = req.body;

  const alumniExists = await alumniModel.findOne({ email: email });
  if (alumniExists) {
    res.send("user already exists");
    res.end();
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAlumni = new alumniModel({
      name: name,
      email: email,
      password: hashedPassword,
      designation: designation,
      company: company,
      school: school,
    });

    await newAlumni.save();

    const token = jwt.sign(
      { email: newAlumni.email, id: newAlumni._id, role: newAlumni.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRES_IN }
    );

    res.status(201).json({ token });
  }
};

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
