const alumniModel= require('./../model/alumniModel')



exports.gettingSchoolWise  = async(req,res,next)=>{

    try {
        let school = req.params.school    
        const alumni = await alumniModel.find({school : school}).select('-password')
        console.log(alumni);
        res.render('schoolWise' , {alumni:alumni}) 
    } catch (error) {
        console.log(error.messgae);
        res.send('err. not found')
    }
   
    }

exports.gettingIdWise = async(req,res,next)=>{

    try {
        let id = req.params.id 
        let alumni = await alumniModel.findById(id).select('-password').lean()
 
       return  res.render('alumniProfile' , {alumni:alumni})
    } catch (error) {
        console.log(error);
        res.send("error not found")
    }
     }
    



exports.alumniSearch = async(req,res,next)=>{
    let name = req.query.name
    name = name.trim()
    // console.log(name);

    let nameRegex = new RegExp('^' + name, 'i'); 
    console.log(nameRegex);

    let Allalumnis = await alumniModel.find({name:nameRegex}).select('-password')

    if(Allalumnis.length > 0){
        return res.status(200).json({
            alumins : Allalumnis
        })
    }else{
        return res.status(404).json({
            messgae : 'no alumni with the given name'
        })
    }
}

exports.getAlumniArticles = async(req,res,next)=>{
    if(req.user.role !=='alumni'){
        return res.send('you are not authorized')
    }
 
      const alumniId = req.user.id;
    
      const { articles } = await alumniModel
      .findOne({ _id: alumniId })
      .populate("articles");

  // Render the EJS template with the articles data
  res.render('alumniArticles', { articles });
}







