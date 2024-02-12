const express = require("express");
const router = express.Router();
const meeting = require('./../controllers/meetingController')

const { tokenValidation } = require("./../utils/tokenValidation");

router.use("/meetings", tokenValidation);
router.use("/mymeet", tokenValidation);
router.use("/poll", tokenValidation);


// meeting route
router
  .route("/meetings")
  .get(meeting.allMeetingsGet)
  .post(meeting.meetingPost);


// individual alumni meet
router.route("/mymeet")
.get(meeting.individualAlumniMeets);


// getting all polls and creating
router.route('/poll')
.get(meeting.allMeetingsGet)
.post(meeting.createPoll)

module.exports = router;
