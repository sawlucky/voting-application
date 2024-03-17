const jwt = require("jsonwebtoken");
const secret = "123456";
const generateToken = (payload) => {
  return jwt.sign(payload, secret);
};
const jwtAuthMiddleware = (req, res, next) => {
  console.log("Called jwtAuthMiddleware");
  const authorization = req.headers.authorization;
  if (!authorization)
    return res.status(401).send({ message: "No token provided" });
  console.log("User is authenticated");
  const token = authorization.split(" ")[1]; // Fixed here
  if (!token) return res.status(401).send({ message: "Can't access token" }); // Fixed here
  try {
    const decode = jwt.verify(token, secret);
    req.user = decode;
    //req.user will hold the decoded payload of the JWT token, which typically contains information about the authenticated user, such as their user ID, username, or any other relevant data you included when creating the token.
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid token" }); // Handle token verification errors
  }
};
module.exports = { generateToken, jwtAuthMiddleware };
