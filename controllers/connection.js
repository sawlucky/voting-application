// const mongoose = require("mongoose");
const { generateToken, jwtAuthMiddleware } = require("../jwt");
const UserSchema = require("../models/user");

const HandleSignup = async (req, res) => {
  console.log("inside handleSignup");
  const body = req.body;
  try {
    const newUser = new UserSchema(body);
    const response = await newUser.save();
    const payload = {
      id: response.id,
    };
    const token = generateToken(payload);
    return res.send({ response, token });
  } catch (err) {
    return res.status(401).send({ error: "cant create/signup" });
  }
};

const Handlelogin = async (req, res) => {
  const { aadharNumber, password } = req.body;
  try {
    const person = await UserSchema.findOne({ aadharNumber: aadharNumber });
    if (!person || !(await person.comparePassword(password)))
      throw Error("Invalid Password and aadhr number");
    const payload = {
      id: person.id,
    };
    const token = generateToken(payload);
    res.status(200).send({ token });
  } catch (err) {
    return res
      .status(500)
      .send({ error: "cant find data wrong pass or username" });
  }
};

const HandleDisplayProfile = async (req, res) => {
  try {
    const userData = req.user; // yeh data humko mil rha req.user  decode jwtmiddleware se
    const UserId = userData.id;

    const user = await UserSchema.findById(UserId);
    res.status(200).json({ user });
  } catch (err) {
    return res.status(500).send({ error: "can't display profile" });
  }
};
const HandleChangePassword = async (req, res) => {
  const userid = req.user; // ye humko token se mil rha h
  const { oldpassword, newpassword } = req.body;
  const user = await UserSchema.findById(userid);
  if (!(await user.comparePassword(oldpassword)))
    return res.status(400).send({ error: "Old Password is incorrect" });

  user.password = newpassword;
  await user.save();
  res.status(201).send({ message: "Password changed successfully" });
};
module.exports = {
  HandleSignup,
  Handlelogin,
  HandleDisplayProfile,
  HandleChangePassword,
};
