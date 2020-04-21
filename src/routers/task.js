const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/task');

router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':');
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    await req.user.populate({
      path: 'usersTasks',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    }).execPopulate();
    res.send(req.user.usersTasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({
      _id, 
      owner: req.user._id
    })
    
    if (!task) {
      return res.status(404).send();
    }
    
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const allowedUpdates = ["description", "completed"];
  const attemptedUpdate = Object.keys(req.body);
  const isValidOperation = attemptedUpdate.every((updateKey) =>
    allowedUpdates.includes(updateKey)
  );

  if (!isValidOperation) {
    return res.status(404).send({ error: "Invalid task update." });
  }

  try {
    const task = await Task.findOne({
      _id, 
      owner: req.user._id
    });

    if (!task) {
      return res.status(404).send();
    }

    attemptedUpdate.forEach(updateField => task[updateField] = req.body[updateField] );
    await task.save();
    
    res.send(task);
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const task = await Task.findOneAndDelete({
      _id, owner: req.user._id
    });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;