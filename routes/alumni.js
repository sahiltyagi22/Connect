const express = require('express')
const alumni = require('./../controllers/alumniController')
const alumniModel = require('../model/alumniModel')
const router = express.Router()

const {tokenValidation} = require('./../utils/tokenValidation')

router.use('/myArticles' , tokenValidation)


// Getting alumnis based on their school
router.route('/alumni/:school')
.get(alumni.gettingSchoolWise)


// Getting alumnis based on their id
router.route('/alumni/:school/:id')
.get(alumni.gettingIdWise)


// searching for particular alumni with name
router.route('/search')
.get(alumni.alumniSearch)


router.get('/profile/:id',async(req,res)=>{
    
        try {
            const alumniId = req.params.id;
            const alumni = await alumniModel.findById(alumniId); // Fetch user details from the database
            
            res.render('userProfile', { alumni }); // Render the user details along with the image address
        } catch (error) {
            res.status(500).send('Error fetching user details');
        }
    });


router.route('/myArticles')
.get(alumni.getAlumniArticles)


// exporting modules
module.exports = router 


