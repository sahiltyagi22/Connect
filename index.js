require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const path = require('path')
const app = express()

const alumniRoute = require('./routes/alumni')
const meetingRoute = require('./routes/meeting')
const authRoute = require('./routes/authRoute')
const articleRoute = require('./routes/articles')

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


mongoose.connect('mongodb://127.0.0.1/alumni')
.then(()=>{
    console.log("db connected");
})
.catch((err)=>{
    console.log(err);
})


app.use(express.urlencoded({extended:true}))
app.use(express.json())



app.get('/',(req,res)=>{
    res.send("this is the homepage")
})


app.use(authRoute)
app.use(meetingRoute)
app.use(alumniRoute)
app.use(articleRoute)

app.all("*" , (req,res)=>{
    res.send("404 not found")
})


app.listen(3000 ,()=>{

})