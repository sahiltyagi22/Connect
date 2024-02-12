const meetingModel = require("./../model/meetingModel");
const alumniModel = require("./../model/alumniModel");
const pollModel = require("./../model/pollModel");
const { tokenValidation } = require("./../utils/tokenValidation");


// getting all meetings
exports.allMeetingsGet = (req, res, next) => {
  res.send("this is where meeting creating form will be there");
};



// posting meeting
exports.meetingPost = async (req, res, next) => {
  if (req.user.role !== "alumni") {
    return res.send("you are forbidden from creating meetings");
  }

  console.log(req.user.role);
  const { title, date, time, link } = req.body;

  const host = req.user.id;

  console.log(host);

  if (!title || !date || !time || !link) {
    return res.send("Please provide all the required fields");
  }

  const meeting = await meetingModel.create({
    title: title,
    date: date,
    time: time,
    host: host,
    link: link,
  });

  // updating alumni's meetings array
  await alumniModel.findByIdAndUpdate(host, {
    $push: { meetings: meeting._id },
  });

  res.send(meeting);
};


// alumni's meetings list route
exports.individualAlumniMeets = async(req,res,next)=>{
    if (req.user.role !== "alumni") {
        return res.redirect("/");
      }
    
      const alumniId = req.user.id;
    
      const alumniMeetings = await alumniModel
        .findOne({ _id: alumniId })
        .populate("meetings");
    
      res.send(alumniMeetings.meetings);
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