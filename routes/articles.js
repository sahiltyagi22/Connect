const express = require('express')
const router = express.Router()
const {tokenValidation} = require('./../utils/tokenValidation')

const articleController = require('./../controllers/articleController')

router.use('/article/new' , tokenValidation)
router.use('/myarticles' , tokenValidation)
router.use('/new-article' , tokenValidation)

// getting all articles
router.route('/articles')
.get(articleController.allArticlesGet)


// getting articles by Id
router.route('/article/:id')
.get(articleController.articleById)

router.route('/new-article')
.get(articleController.newArticleGet)
.post(articleController.postNewArticle)

router.route('/update-article/:id')
.get(articleController.updateArticleGet)
.post(articleController.updateArticlePost);

router.route('/delete-article/:id')
.get(articleController.deleteArticle)




module.exports = router