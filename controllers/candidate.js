const CandidateSchema = require("../models/Candidate");
const UserSchema = require("../models/Candidate");
const { jwtAuthMiddleware } = require("../jwt");
const checkAdminrole = async (userid) => {
  try {
    const verify = await UserSchema.findById(userid);
    return verify.role === "admin";
  } catch (err) {
    console.log(err);
    return false;
  }
};
const HandleCandidatePost = async (req, res) => {
  try {
    const userid = req.user;
    // if (!(await checkAdminrole(userid))) {
    //   // ye req,user h isme decode kia h and uske andar mera id h
    //   return res.status(403).json({ error: "you are not authorized here" });
    // }
    const body = req.body;
    const newCandidate = new CandidateSchema(body);
    const response = await newCandidate.save();
    return res.status(200).send({ response });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};

const HandlePut = async (req, res) => {
  if (!checkAdminrole(req.user.id))
    return res.status(400).json({ error: "you are not authorized" });

  try {
    const iid = req.params.candidateid;
    const data = req.body;
    const getuser = await CandidateSchema.findByIdAndUpdate(iid, data, {
      new: true,
      runValidators: true,
    });
    if (!getuser) {
      return res.status(404).json({ error: "User Not Found!" });
    }
    return res.status(200).send({ response: getuser });
  } catch (err) {
    res.status(404).send({ error: "cant find user" });
  }
};

const HandleDelete = async (req, res) => {
  if (!checkAdminrole(req.user.role)) {
    return res.status(400).json({ error: "you are not authorized" });
  }
  try {
    const iid = req.params.candidateid;
    const getuser = await CandidateSchema.findByIdAndDelete(iid);
    if (!getuser) {
      return res.status(404).json({ error: "User Not Found!" });
    }
    console.log("user deleted");
    return res.status(200).send({ response: getuser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "internal server error" });
  }
};
module.exports = { HandleCandidatePost, HandlePut, HandleDelete };
