const articleModel = require('./../model/articlesModel')
const alumniModel = require('./../model/alumniModel')



// all articles
exports.allArticlesGet = async(req,res,next)=>{
    const articles = await articleModel.find({})
    return res.render('allArticles', {articles:articles})
}


// getting articles by Id
exports.articleById = async(req,res,next)=>{
    let id = req.params.id

const article = await articleModel.findById(id)
return res.render('singleArticle',{article :article})
}


// new article get
exports.newArticleGet = async(req,res,next)=>{
    if(req.user.role !== "alumni"){
        return res.redirect('/articles')
    }
   res.render('newArticle')
}

// new article post
exports.postNewArticle = async(req,res,next)=>{
    const {title , body}  = req.body

    let creator = req.user.id

    const newArticle = new articleModel({
        title :title,
        body:body,
        creator :creator
    })

    await  newArticle.save()

    const alumni = await alumniModel.findById({_id : creator})

    alumni.articles.push(newArticle._id)
    await alumni.save()

   

    res.redirect('/articles')
}


// update article
exports.updateArticleGet = async(req,res,next)=>{
    const id= req.params.id

    const article = await articleModel.findById(id)
    res.render('editArticle' , {article})
}

exports.updateArticlePost = async(req,res,next)=>{
    try {
        const { title, body } = req.body;
        const updatedArticle = await articleModel.findByIdAndUpdate(req.params.id, { title, body }, { new: true });
        res.redirect('/myArticles'); // Redirect to the articles page after updating
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


// deleting an article
exports.deleteArticle = async(req,res,next)=>{
    const articleId = req.params.id;

    try {
        // Find the article by ID and delete it
        const deletedArticle = await articleModel.findByIdAndDelete(articleId);

        if (!deletedArticle) {
            return res.status(404).json({ error: 'Article not found' });
        }

       res.redirect('/myArticles')
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}