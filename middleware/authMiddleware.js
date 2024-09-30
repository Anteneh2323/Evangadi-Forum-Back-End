const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;


  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];
  try {
    // Decode the token
    const { username, userid } = jwt.verify(token, process.env.JUT_SECRET);

    // Attach decoded data to the request object
    req.user = { username, userid };

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid token" });
  }
}

module.exports = authMiddleware;
