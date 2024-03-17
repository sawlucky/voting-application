const express = require("express");
const router = express.Router();

// middleware
const { logrequest } = require("../middleware/middleware");
router.use(logrequest);
const { jwtAuthMiddleware } = require("../jwt");

//routes
const {
  HandleCandidatePost,
  HandlePut,
  HandleDelete,
} = require("../controllers/candidate");
router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

router.post("/", jwtAuthMiddleware, HandleCandidatePost);
router.put("/:candidateid", HandlePut);
router.delete("/:candidateid", HandleDelete);
module.exports = router;
