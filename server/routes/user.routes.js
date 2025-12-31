
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth.middleware");
const router = express.Router();
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ msg: "User exists" });

  const user = await User.create({ name, email, password });

  res.json({ msg: "Registered successfully" });
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id ,
      name:user.name,
      email:user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token,
    id:user._id,
    user: {
      
    name:user.name,
      email:user.email
    }

  });
});

router.get("/all-users", auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user } }).select("-password"); 
    // -password excludes password field
    res.json(users);
    console.log(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;


module.exports = router;
