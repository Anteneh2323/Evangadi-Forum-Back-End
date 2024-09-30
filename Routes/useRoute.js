const express = require("express");
const router = express.Router();

//Authentication middleware
const authMiddleware = require("../middleware/authMiddleware");

//user controllers
const { Register, Login, CheckUser } = require("../Controller/UserController");

// register route
router.post("/register", Register);

// login route
router.post("/login", Login);

// check user route
router.get("/check", authMiddleware, CheckUser);

module.exports = router;
