var express = require("express");
var router = express.Router();

const bodyparser = require("body-parser");
router.use(bodyparser.json());
//Handlemongodb;
const { HandleMongodb } = require("./users");
HandleMongodb("mongodb://127.0.0.1:27017/votingapp")
  .then(() => {
    console.log("mongodb connected");
  })
  .catch(() => {
    console.log("mongodb not connected");
  });
///middleware///
const { logrequest } = require("../middleware/middleware");
router.use(logrequest);

//jwt
const { generateToken, jwtAuthMiddleware } = require("../jwt");

//routes
const {
  HandleSignup,
  Handlelogin,
  HandleDisplayProfile,
  HandleChangePassword,
} = require("../controllers/connection");

router.post("/signup", HandleSignup);
router.post("/login", Handlelogin);

router.get("/profile", jwtAuthMiddleware, HandleDisplayProfile);
router.put("/profile/password", jwtAuthMiddleware, HandleChangePassword);

module.exports = router;
