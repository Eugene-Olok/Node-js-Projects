const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

//register handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //check for required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }
  //Check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  //check password length
  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password2 });
  } else {
    //validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //user exits
        errors.push({ msg: "Email is already registered" });
        res.render("register", { errors, name, email, password, password2 });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        // hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            //set password to hash
            newUser.password = hash;

            //save user
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "Success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
});

//Login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

//logout handle
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("Success_msg", "You are logged out");
  res.redirect("/users/login");
});
module.exports = router;