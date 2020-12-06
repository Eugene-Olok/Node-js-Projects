const { model } = require("mongoose");
const { ensureAuthenticated } = require("../config/auth");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.render("welcome");
});

router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("dashboard", {
    name: req.user.name,
  });
});

module.exports = router;
