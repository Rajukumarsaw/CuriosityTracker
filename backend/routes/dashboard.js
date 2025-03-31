const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const { subDays, startOfDay, endOfDay, format, differenceInDays } = require('date-fns');

router.get('/', async (req, res) => {
  try {
    // Get total number of entries
    const totalEntries = await Entry.countDocuments();
    
    // Get recent entries
    const recentEntries = await Entry.find()
      .sort({ date: -1, startTime: -1 })
      .limit(5);
    
    // Calculate average energy level
    const energyResult = await Entry.aggregate([
      { $group: { _id: null, avgEnergy: { $avg: '$energyLevel' } } }
    ]);
    
    const avgEnergyLevel = energyResult.length > 0 ? energyResult[0].avgEnergy : 0;
    
    // Calculate top question types
    const entries = await Entry.find();
    const questionTypesMap = {};
    let totalQuestions = 0;
    
    entries.forEach(entry => {
      entry.questionTypes.forEach(type => {
        if (questionTypesMap[type]) {
          questionTypesMap[type]++;
        } else {
          questionTypesMap[type] = 1;
        }
        totalQuestions++;
      });
    });
    
    const topQuestionTypes = Object.keys(questionTypesMap)
      .map(type => ({
        name: type,
        count: questionTypesMap[type],
        percentage: Math.round((questionTypesMap[type] / totalQuestions) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Calculate streak days
    let streakDays = 0;
    
    if (entries.length > 0) {
      // Sort entries by date
      const sortedDates = [...new Set(entries.map(entry => 
        format(new Date(entry.date), 'yyyy-MM-dd')
      ))].sort((a, b) => new Date(b) - new Date(a));
      
      // Check if there's an entry for today
      const today = format(new Date(), 'yyyy-MM-dd');
      let currentDate = today;
      
      if (sortedDates[0] === today) {
        streakDays = 1;
        let i = 1;
        
        // Check consecutive days backward
        while (i < sortedDates.length) {
          const expectedPrevDate = format(subDays(new Date(currentDate), 1), 'yyyy-MM-dd');
          
          if (sortedDates[i] === expectedPrevDate) {
            streakDays++;
            currentDate = expectedPrevDate;
          } else {
            break;
          }
          
          i++;
        }
      }
    }
    
    res.json({
      totalEntries,
      recentEntries,
      avgEnergyLevel,
      topQuestionTypes,
      streakDays
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;