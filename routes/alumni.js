const express = require('express')
const alumni = require('./../controllers/alumniController')
const router = express.Router()



// Getting alumnis based on their school
router.route('/alumni/:school')
.get(alumni.gettingSchoolWise)


// Getting alumnis based on their id
router.route('/alumni/:school/:id')
.get(alumni.gettingIdWise)


// searching for particular alumni with name
router.route('/search')
.get(alumni.alumniSearch)



// exporting modules
module.exports = router 


