require('dotenv').config(); // for env file
const express = require("express");

const Users = require("../models/users");
const Token = require("../models/token");

const sendEmail = require("../nodemailer/sendEmail")
const crypto = require("crypto")

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
      verified: false,
      theme: "dark",
    });

    console.log("sending email!!!")

    const token = await Token.create({
      user_id: user.user_id,
      token: crypto.randomBytes(32).toString("hex")
    });

    console.log("reached here")

    const url = `${process.env.BASE_URL}/users/${user.user_id}/verify/${token.token}`;

    console.log("THE EMAIL " + user.email)
    await sendEmail(user.username, user.email, "Verify Email", url);

    return res.json(user);
  } catch (error) {
    // res.json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    console.log(email, password);
    const user = await Users.findOne({ where: { email } });

    if (!user) res.json({error: "User not found"})
    // else res.json(userData)

    const match = await comparePassword(password, user.password)

    if (!match) return res.json({error: "User not found"})

    if (!user.verified) {
      let token = await Token.findOne({where: {
        user_id: user.user_id
      }})

      if (!token) {
        token = await Token.create({
          user_id: user.user_id,
          token: crypto.randomBytes(32).toString("hex")
        });

        const url = `${process.env.BASE_URL}/users/${user.user_id}/verify/${token.token}`;
        await sendEmail(user.username, user.email, "Verify Email", url)
      }

      res.status(400).send({message: "An Email Was Sent To Your Account, Please Verify!"})
    }

    jwt.sign({email: user.email, id: user.user_id, username: user.username}, process.env.JWT_SECRET, {expiresIn: "30d"}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, {
        // httpOnly: true, // Helps prevent XSS attacks
        // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS only)
        // sameSite: 'strict', // Helps prevent CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      }).json({email: user.email, id: user.user_id, username: user.username})
    })
  } catch {
    res.json({error: "Unexpected error occured"})
  }
});


router.get("/:id/verify/:token", async (req, res) => {
  try {
    console.log("id" + req.params.id)
    const user = await Users.findOne({where: {user_id: req.params.id}});

    console.log(user)
    if (!user) return res.json({err: "Invalid Link"});

    console.log(user)
    const token = await Token.findOne({ where: {
      user_id: user.user_id,
      token: req.params.token
    }});

    if (!token) return res.json({err: "Invalid Link"});

    user.verified = true;

    await user.save(); // updated user so they are verified in the database
    await token.destroy(); // delete token once user verified

    res.status(200).send({message: "Email Verified"})
  }  catch (err) {
    res.status(500).send({err: "Interal Server Error"})
  }
})



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
