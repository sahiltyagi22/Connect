const express = require('express')
const router = express.Router()

const pollModel = require('./../model/pollModel')
const { tokenValidation } = require("./../utils/tokenValidation");

router.use("/new-poll", tokenValidation);



router.route('/polls')
.get(async(req,res)=>{
    try {
        const polls = await pollModel.find({})
        res.render('poll', {polls})
    } catch (error) {
        console.log(error.message);
        throw new Error('something went wrong')
    }
})

router.route('/new-poll')
.get(async(req,res) =>{
    res.render('newPoll')
})

.post(async (req, res) => {
    const { title, description } = req.body;
    // const author = req.user.id

    try {
        // Create new poll in database using Mongoose or your ORM
        const newPoll = await pollModel.create({ title, description });

        // Redirect to poll listing page or show success message
        res.redirect('/polls');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating poll');
    }

});

// vote count 
router.route('/polls/:id/vote')
.post(async(req,res)=>{
    try{
        const pollid  = req.params.id
        const voteObject = await pollModel.findByIdAndUpdate({_id :pollid})
        voteObject.votecount += 1 
        await voteObject.save()
        // res.redirect('/polls')
        let count = voteObject.votecount
        console.log(count);
        return count
    }catch(error){
        console.log(error.message);
        res.send('there is an error')
    }
})




module.exports = router