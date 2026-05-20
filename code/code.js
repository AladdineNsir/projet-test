import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// fake users DB (just example)
const users = [
  {
    id: 1,
    email: "test@gmail.com",
    password: "$2a$10$abcdef...." // hashed password
  }
];

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. check user exists
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2. check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    // 3. create token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      "secretKey",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;