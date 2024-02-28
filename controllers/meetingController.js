const meetingModel = require("./../model/meetingModel");
const alumniModel = require("./../model/alumniModel");
const pollModel = require("./../model/pollModel");
const { tokenValidation } = require("./../utils/tokenValidation");


// getting all meetings
exports.allMeetingsGet = async(req, res, next) => {
  try {
    const meetings = await meetingModel.find({})

  if(!meetings){
     res.status(404).json({
      message : "not meetings available"
    })
  }

  return res.render('allMeetings' , {meetings :meetings})
  } catch (err) {
    next(err)
  }
  
};



// creating new meeting
exports.newMeetingGet = async (req, res, next) => {
  try {
    if(req.user.role!=='alumni'){
      return res.redirect('/meetings')
    }
    return res.render('newMeeting')
  } catch (err) {
    next(err)
  }
  
};

exports.newMeetingPost = async(req,res,next)=>{
  try {
    let {title , date , time, link} = req.body 

 let host = req.user.id

 const meeting = new meetingModel({
  title : title,
  date : date,
  time :time,
  host :host,
  link : link
 })

 await meeting.save()

//  updating meeting in alumni section
const alumni = await alumniModel.findById(host)
alumni.meetings.push(meeting._id)

await alumni.save()
 

 return res.redirect('/meetings')
  } catch (err) {
    next(err)
  }
  
}


// alumni's meetings list route
exports.individualAlumniMeets = async(req,res,next)=>{
  try {
    if (req.user.role !== "alumni") {
      return res.redirect("/");
    }
  
    const alumniId = req.user.id;
  
    const meetings = await alumniModel
      .findOne({ _id: alumniId })
      .populate("meetings");

  
  
    res.render('alumniMeetings', {meetings:meetings.meetings})
  } catch (err) {
    next(err)
  }
    
}


// polls 
exports.getAllPolls = async(req,res,next)=>{
    const allPolls = await pollModel.find()
    res.send(allPolls)
}

exports.createPoll = async(req,res)=>{
    if(req.user.role !== 'alumni'){
        return res.send("you are forbidden")
      }
    
      let {title} = req.body
      if(!title){
        return  res.send('please provide title')
      }
    
      let author = req.user.id
    
      const newPoll = new pollModel({
        title:title,
        author:author
      })
    
    await newPoll.save()
    
    res.send(newPoll)
    
}