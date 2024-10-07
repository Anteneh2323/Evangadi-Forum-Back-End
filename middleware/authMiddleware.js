const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET; // Ensure you are using the correct secret

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token and decode the payload
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // Attach the decoded user info to the request

    next(); // Proceed to the next middleware or route
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;
