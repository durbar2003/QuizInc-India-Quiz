const express = require("express");

const router = express.Router();

const Question = require("../models/Question");
const User = require("../models/User");

// 1. QUESTIONS
// get all quiz questions
router.get("/sendit", async (req, res) => {
  try {
    const questions = await Question.find();
    return res.status(200).json(questions);
  } catch (err) {
    return res.status(500).json({
      err,
    });
  }
});

// get one quiz question
router.get("/sendit/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    const question = await Question.findOne({
      _id,
    });
    if (!question) {
      return res.status(404).json({});
    } else {
      return res.status(200).json(question);
    }
  } catch (err) {
    return res.status(500).json({
      err,
    });
  }
});

// create one quiz question
router.post("/sendit", async (req, res) => {
  try {
    const {
      description
    } = req.body;
    const {
      answer
    } = req.body;
    const {
      imgurl
    } = req.body;
    const {
      index
    } = req.body;

    const question = await Question.create({
      description,
      answer,
      imgurl,
      index,
    });

    return res.status(201).json(question);
  } catch (err) {
    return res.status(500).json({
      err,
    });
  }
});

// update one quiz question
router.put("/sendit/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const {
      description,
      answer,
      index
    } = req.body;

    let question = await Question.findOne({
      _id,
    });

    if (!question) {
      question = await Question.create({
        description,
        answer,
        index,
      });
      return res.status(201).json(question);
    } else {
      question.description = description;
      question.answer = answer;
      question.index = index;
      await question.save();
      return res.status(200).json(question);
    }
  } catch (err) {
    return res.status(500).json({
      err,
    });
  }
});

// delete one quiz question
router.delete("/sendit/:id", async (req, res) => {
  try {
    const _id = req.params.id;

    const question = await Question.deleteOne({
      _id,
    });

    if (question.deletedCount === 0) {
      return res.status(404).json();
    } else {
      return res.status(204).json();
    }
  } catch (err) {
    return res.status(500).json({
      error,
    });
  }
});

module.exports = router;