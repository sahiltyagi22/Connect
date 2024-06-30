const alumniModel = require("./../model/alumniModel");

exports.gettingSchoolWise = async (req, res, next) => {
  try {
    let school = req.params.school;
    const alumni = await alumniModel.find({school : school});
    res.render("schoolWise", { alumni: alumni });
  } catch (err) {
    next(err , {message : "something went wrong! we are fixing it"})
  }
};

exports.gettingIdWise = async (req, res, next) => {
  try {
    let id = req.params.id;
    let alumni = await alumniModel.findById(id).select("-password").lean();

    return res.render("alumniProfile", { alumni: alumni });
  } catch (err) {
    next(err , {message : "something went wrong! we are fixing it"})
  }
};

exports.alumniSearch = async (req, res, next) => {
    try {
        let name = req.query.name;
  name = name.trim();
  // console.log(name);

  let nameRegex = new RegExp("^" + name, "i");

  let Allalumnis = await alumniModel
    .find({ name: nameRegex })
    .select("-password");

  if (Allalumnis.length > 0) {
    return res.status(200).json({
      alumins: Allalumnis,
    });
  } else {
    return res.status(404).json({
      messgae: "no alumni with the given name",
    });
  }
    } catch (err) {
        next(err)
    }
  
};

exports.getAlumniArticles = async (req, res, next) => {
    try {
        if (req.user.role !== "alumni") {
            return res.redirect('/')
          }
        
          const alumniId = req.user.id;
        
          const { articles } = await alumniModel
            .findOne({ _id: alumniId })
            .populate("articles");
        
          // Render the EJS template with the articles data
          res.render("alumniArticles", { articles });
    } catch (err) {
      next(err , {message : "something went wrong! we are fixing it"})
    }
 
};
