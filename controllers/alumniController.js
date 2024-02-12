const alumniModel= require('./../model/alumniModel')


exports.gettingSchoolWise  = async(req,res,next)=>{
    let school = req.params.school
    // console.log(school);
    if(validSchool(school)){
        const alumnis = await alumniModel.find({school : school}).select('-password')
        console.log(alumnis);
        return res.json({
            alumni : alumnis
        })
    }else{
        res.send("not valid")
    }
}


exports.gettingIdWise = async(req,res,next)=>{
    if(validSchool(req.params.school)){
        let id = req.params.id 
        let alumni = await alumniModel.findById(id).select('-password').lean()
 
       return  res.send(alumni)
     }else{
         res.send('err not found')
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






function validSchool(school){
    const schoolArrray = ['soict' , 'sovsas' , 'sobt' , 'soe']
    if(schoolArrray.includes(school)){
        return true
    }else{
        return false
    }
}

