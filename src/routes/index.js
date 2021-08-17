const express = require("express")
const Question = require("../models/Question")
const User = require("../models/User")
const router = express.Router()
const { ensureAuth, ensureGuest } = require("../middleware/auth")

// @desc Login/Landing Page
// @route GET /
router.get("/", ensureGuest, (req, res) => {
  if (
    new Date().getTime() < new Date("aug 10, 2021 19:59:00 GMT+05:30").getTime()
  ) {
    res.render("comingsoon", {
      layout: "comingsoon",
    })
  } else {
    res.render("login", {
      layout: "login",
    })
  }
})

// @desc Dashboard
//  @route GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const questions = await Question.find({}).lean()
    res.render("dashboard", {
      name: req.user.firstName,
      questions,
    })
  } catch (err) {
    console.log(err)
    res.render("error/500")
  }
})

// @desc Form submit
//  @route POST /submit
router.post("/submit", (req, res) => {
  let sub = Object.values(req.body)
  let ans = []
  sub.forEach((opt, idx) => {
    opt = opt.toLowerCase()
    ans[idx] = opt.split(" ")
  })
  let score = 0
  ans.forEach(async (opt, idx) => {
    const corr = await Question.findOne({
      index: idx,
    })
    corr.answer = corr.answer.toLowerCase()
    let correct = corr.answer.split(" ")
    let res = correct.some((val) => {
      return opt.indexOf(val) >= 0
    })
    if (res) {
      score += 10
    }
  })
  setTimeout(async () => {
    const user = await User.findByIdAndUpdate(req.user.id, {
      score,
      completed: true,
      submittedAt: Date.now(),
      answers: sub,
    })
  }, 15000)

  // console.log(req.user.id);
  res.render("finished")
})

module.exports = router
