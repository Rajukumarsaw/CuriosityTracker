const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');

router.get('/', async (req, res) => {
    try {
      const entries = await Entry.find().sort({ date: -1, startTime: -1 });
      res.json(entries);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Get specific entry
  router.get('/:id', async (req, res) => {
    try {
      const entry = await Entry.findById(req.params.id);
      if (!entry) return res.status(404).json({ message: 'Entry not found' });
      res.json(entry);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // Create new entry
  router.post('/', async (req, res) => {
    const entry = new Entry({
      title: req.body.title,
      description: req.body.description,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      questions: req.body.questions,
      questionTypes: req.body.questionTypes,
      output: req.body.output,
      energyLevel: req.body.energyLevel
    });
  
    try {
      const newEntry = await entry.save();
      res.status(201).json(newEntry);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Update entry
  router.put('/:id', async (req, res) => {
    try {
      const entry = await Entry.findById(req.params.id);
      if (!entry) return res.status(404).json({ message: 'Entry not found' });
  
      // Update fields
      if (req.body.title) entry.title = req.body.title;
      if (req.body.description) entry.description = req.body.description;
      if (req.body.date) entry.date = req.body.date;
      if (req.body.startTime) entry.startTime = req.body.startTime;
      if (req.body.endTime) entry.endTime = req.body.endTime;
      if (req.body.questions) entry.questions = req.body.questions;
      if (req.body.questionTypes) entry.questionTypes = req.body.questionTypes;
      if (req.body.output) entry.output = req.body.output;
      if (req.body.energyLevel) entry.energyLevel = req.body.energyLevel;
  
      const updatedEntry = await entry.save();
      res.json(updatedEntry);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  // Delete entry
  router.delete('/:id', async (req, res) => {
    try {
      const entry = await Entry.findById(req.params.id);
      if (!entry) return res.status(404).json({ message: 'Entry not found' });
  
      await entry.remove();
      res.json({ message: 'Entry deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  module.exports = router;