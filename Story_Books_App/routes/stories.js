const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/stories");

//desc: Show Add Page
//route: GET /stories/add
router.get("/add", ensureAuth, (req, res) => res.render("stories/add"));

//desc: Process add form
//route: POST /stories/add
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

//desc: Show All stories
//route: GET /stories/add
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createAt: "desc" })
      .lean();
    res.render("stories/index", {
      stories,
    });
  } catch (error) {
    console.error(error);
    res.render("error/404");
  }
});

//desc: Show single question
//route: GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      return res.render("error/404");
    }
    res.render("stories/show", {
      story,
    });
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

//desc: delete question
//route: GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

//desc: User questions
//route: GET /stories/user/:userID
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("stories/index", {
      stories,
    });
  } catch (error) {
    console.error(error);
    return res.render("error/500");
  }
});

module.exports = router;
