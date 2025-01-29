require('dotenv').config(); // for env file
const express = require("express");
const Users = require("../models/users");
const { hashPassword, comparePassword } = require("../helpers/auth");
const router = express.Router();
const { sequelize } = require("../config/database");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    username = username.trim();
    email = email.trim();
    password = password.trim();

    console.log(username, email, password);
    // check if email in use
    const emailExists = await Users.findOne({ where: { email } });
    if (emailExists) res.json({ error: "Email already exists" });

    const hashedPassword = await hashPassword(password);

    const user = await Users.create({
      username,
      email,
      password: hashedPassword,
      theme: "dark",
    });

    return res.json(user);
  } catch (error) {
    res.json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log(email, password);
    const userData = await Users.findOne({ where: { email } });

    if (!userData) res.json({error: "User not found"})
    // else res.json(userData)

    const match = await comparePassword(password, userData.password)

    if (match) {
      jwt.sign({email: userData.email, id: userData.user_id, username: userData.username}, process.env.JWT_SECRET, {expiresIn: "30d"}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token, {
          // httpOnly: true, // Helps prevent XSS attacks
          // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS only)
          // sameSite: 'strict', // Helps prevent CSRF
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        }).json({email: userData.email, id: userData.user_id, username: userData.username})
      })
    } else {
      res.json({error: "User not found"})
    }
  } catch {
    res.json({error: "Unexpected error occured"})
  }
});



router.get("/fetchUser", (req, res) => {

  token = req.cookies.token
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {expiresIn: "30d"}, (err, user) => {
      if (err) throw err;
      res.json(user)
    })
  }
})

module.exports = router;
