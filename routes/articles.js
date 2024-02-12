const express = require('express')
const router = express.Router()
const {tokenValidation} = require('./../utils/tokenValidation')

const articleModel = require('./../model/articlesModel')
const alumniModel = require('../model/alumniModel')

router.use('/article/new' , tokenValidation)
router.use('/myarticles' , tokenValidation)

router.route('/article/new')
.get((req,res)=>{
    if(req.user.role !== "alumni"){
        return res.send('you are not authorized')
    }
    res.send('here you can create and article')
})
.post(async(req,res)=>{
    const {title , body}  = req.body

    let creator = req.user.id

    const newArticle = new articleModel({
        title :title,
        body:body,
        creator :creator
    })

    await  newArticle.save()

    const alumni = await alumniModel.findById({_id : creator})
    console.log(alumni);

    alumni.articles.push(newArticle._id)
    await alumni.save()

   

    res.send(newArticle)
})


router.route('/myArticles')
.get(async(req,res)=>{
    if(req.user.role!=='alumni'){
        return res.send('you are not authorized')
    }
 
      const alumniId = req.user.id;
    
      const alumniArticles = await alumniModel
        .findOne({ _id: alumniId })
        .populate("articles");
    
      res.send(alumniArticles.articles);
})

module.exports = router