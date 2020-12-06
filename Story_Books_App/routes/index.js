const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/stories");

//desc: login/landing Page
//route: GET
router.get("/", ensureGuest, (req, res) =>
  res.render("login-views", { layout: "login" })
);

//desc: DashBoard
//route: GET ? dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      stories,
    });
  } catch (error) {
    console.log(err);
    res.render("error/500");
  }
});

module.exports = router;
