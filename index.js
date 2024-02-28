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
const articleRoute = require('./routes/articles')

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


mongoose.connect(process.env.CONNECTION)
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
    
    console.log(err.message);
    console.error(err.stack);

    // Set response status code
    res.status(err.status || 500);

    let message = err.message

    // Render a page with an error message
    res.render('error', { message: message|| "OOPS! Something went wrong. Please try again later" });
});



app.all("*" , (req,res)=>{
   res.render('notFound')
})


app.listen(3000 ,()=>{

})