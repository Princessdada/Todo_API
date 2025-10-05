const express = require("express");
const passport = require("passport");
const User = require("../model/user");

const router = express.Router();
// GET: Login page
router.get("/login", (req, res) => {
  res.render("login", { message: null });
});

// GET: Signup page
router.get("/signup", (req, res) => {
  res.render("signup", { message: null });
});

// signup
router.post("/signup", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await User.create({ email, username, password });
    return res.redirect("/login");
  
  } catch (err) {
    return res.render("signup", { message: err.message });
  }
});

// login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json(err);
    }
    if (!user) {
      return res.render("login", {
        message: info?.message || "login failed",
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/tasks");
    });
   
  })(req, res, next);
});

// logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.redirect("/login");
  });
});

module.exports = router;
