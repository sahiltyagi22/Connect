require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser');
const ejs = require('ejs')
const path = require('path')
const app = express()

const alumniRoute = require('./routes/alumni')
const meetingRoute = require('./routes/meeting')
const authRoute = require('./routes/authRoute')
const articleRoute = require('./routes/articles');
const { log } = require('console');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


mongoose.connect(process.env.MONGOCONNECTION)
.then(()=>{
    console.log("db connected");
})
.catch((err)=>{
    console.log(err);
})


app.use(express.urlencoded({extended:true}))
app.use(express.json())


// home route
app.get('/',(req,res)=>{
    res.render('homepage')
})

// auth route
app.use(authRoute)

// meeting route
app.use(meetingRoute)

// alumni route
app.use(alumniRoute)

// article route
app.use(articleRoute)


// error handeling middleware
app.use((err, req, res, next) => {
    res.send('<h1> Something went Wrong </h1>')
});

app.all("*" , (req,res)=>{
   res.render('notFound')
})


let PORT = process.env.PORT || 4001
app.listen( PORT,()=>{

})