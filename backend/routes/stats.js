const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const { subDays, startOfDay, endOfDay, format } = require('date-fns');

// Get statistics based on timeFrame
router.get('/', async (req, res) => {
  try {
    const { timeFrame } = req.query;
    let startDate;
    const today = new Date();

    // Determine date range based on timeFrame
    switch (timeFrame) {
      case 'week':
        startDate = subDays(today, 7);
        break;
      case 'month':
        startDate = subDays(today, 30);
        break;
      case 'year':
        startDate = subDays(today, 365);
        break;
      default:
        startDate = new Date(0); // All time
    }

    // Get entries within date range
    const entries = await Entry.find({
      date: { $gte: startOfDay(startDate), $lte: endOfDay(today) }
    });

    // Process question types distribution
    const questionTypesMap = {};
    entries.forEach(entry => {
      entry.questionTypes.forEach(type => {
        if (questionTypesMap[type]) {
          questionTypesMap[type]++;
        } else {
          questionTypesMap[type] = 1;
        }
      });
    });

    const questionTypes = Object.keys(questionTypesMap).map(type => ({
      name: type,
      value: questionTypesMap[type]
    }));

    // Process energy levels by activity type (using title as proxy)
    const energyByActivity = {};
    entries.forEach(entry => {
      if (!energyByActivity[entry.title]) {
        energyByActivity[entry.title] = {
          total: entry.energyLevel,
          count: 1
        };
      } else {
        energyByActivity[entry.title].total += entry.energyLevel;
        energyByActivity[entry.title].count++;
      }
    });

    const energyLevels = Object.keys(energyByActivity).map(activity => ({
      name: activity,
      value: energyByActivity[activity].total / energyByActivity[activity].count
    }));

    // Calculate time spent per day
    const timeSpentMap = {};
    entries.forEach(entry => {
      const dateStr = format(new Date(entry.date), 'MMM d');
      
      // Calculate duration in hours
      const [startHours, startMinutes] = entry.startTime.split(':').map(Number);
      const [endHours, endMinutes] = entry.endTime.split(':').map(Number);
      
      let durationMinutes = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
      if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle crossing midnight
      
      const durationHours = durationMinutes / 60;
      
      if (timeSpentMap[dateStr]) {
        timeSpentMap[dateStr] += durationHours;
      } else {
        timeSpentMap[dateStr] = durationHours;
      }
    });

    const timeSpent = Object.keys(timeSpentMap).map(date => ({
      date,
      hours: parseFloat(timeSpentMap[date].toFixed(2))
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate entries per day
    const entriesPerDayMap = {};
    entries.forEach(entry => {
      const dateStr = format(new Date(entry.date), 'MMM d');
      if (entriesPerDayMap[dateStr]) {
        entriesPerDayMap[dateStr]++;
      } else {
        entriesPerDayMap[dateStr] = 1;
      }
    });

    const entriesPerDay = Object.keys(entriesPerDayMap).map(date => ({
      date,
      count: entriesPerDayMap[date]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      questionTypes,
      energyLevels,
      timeSpent,
      entriesPerDay
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;