const express = require("express");
const expressLayousts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
require("./config/passport")(passport);

const app = express();

// DB CONFIG
const db = require("./config/keys").MongoURI;

//connect to mongodb
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`MongoDB connected`))
  .catch((err) => console.log(err));

//EJS
app.use(expressLayousts);
app.set("view engine", "ejs");

//bodyparser
app.use(express.urlencoded({ extended: false }));

//Express sessions
app.use(
  session({
    secret: "Keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("Sucess_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
