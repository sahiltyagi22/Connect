const express = require("express");
const router = express.Router();
const meeting = require("./../controllers/meetingController");
const meetingModel = require("./../model/meetingModel");

const { tokenValidation } = require("./../utils/tokenValidation");
const alumniModel = require("../model/alumniModel");

router.use("/meetings", tokenValidation);
router.use("/mymeet", tokenValidation);
router.use("/new-meeting", tokenValidation);
router.use("/delete-meeting/:id", tokenValidation);

// meeting route
router.route("/meetings").get(meeting.allMeetingsGet);

router
  .route("/new-meeting")
  .get(meeting.newMeetingGet)
  .post(meeting.newMeetingPost);

// individual alumni meet
router.route("/mymeet").get(meeting.individualAlumniMeets);

router.route("/delete-meeting/:id").get(async (req, res) => {
  const id = req.params.id;

  const meeting = await meetingModel.findByIdAndDelete(id);

  res.redirect("/mymeet");
});

router
  .route("/edit-meeting/:id")

  .get(async (req, res) => {
    const id = req.params.id;

    const meeting = await meetingModel.findById(id);
    res.render("editMeeting", { meeting });
  })
  .post(async(req,res)=>{
    try {
      const { title, time, date, link } = req.body;
      const updatedArticle = await meetingModel.findByIdAndUpdate(req.params.id, { title, time,date,link }, { new: true });
      res.redirect('/mymeet'); // Redirect to the articles page after updating
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
  })

module.exports = router;
