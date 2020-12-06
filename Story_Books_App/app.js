const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const Mongostore = require("connect-mongo")(session);
const mongoose = require("mongoose");

const app = express();

//body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// load config
dotenv.config({ path: "./config/config.env" });

//passport config
require("./config/passport")(passport);

//connect to DB
connectDB();

//handlebars helper
const { formatDate, stripTags, truncate, editIcon } = require("./helpers/hbs");

//express-handlebars
app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, stripTags, truncate, editIcon },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//Express-Sessions
app.use(
  session({
    secret: "keyword cat",
    resave: false,
    saveUninitialized: false,
    store: new Mongostore({ mongooseConnection: mongoose.connection }),
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// setting global variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//STATIC FOLDER
app.use(express.static(path.join(__dirname, "public")));

//ROUTES
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));
