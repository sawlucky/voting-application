const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    aadharNumber: {
      type: Number,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["voter", "admin"],
      default: "voter",
    },
    isVoted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const person = this;
  if (!person.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(person.password, salt);
    person.password = hashPassword;
    next();
  } catch (err) {
    next(err);
  }
});
// Method to compare a plain text password with the encrypted one in the database
UserSchema.methods.comparePassword = async function (candidatepassword) {
  try {
    const isMatch = await bcrypt.compare(candidatepassword, this.password);
    return isMatch;
  } catch (err) {
    return res.status(401).send({ message: "wrong password" });
  }
};
module.exports = mongoose.model("User", UserSchema);
