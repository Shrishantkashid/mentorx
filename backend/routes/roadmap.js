const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getDB } = require('../config/database');

const router = express.Router();

/**
 * @route GET /api/roadmap
 * @desc Get the current user's roadmap
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const db = await getDB();
    const collection = db.collection('user_roadmaps');

    const roadmap = await collection.findOne({ user_id: userId });

    if (!roadmap) {
      return res.json({
        success: true,
        data: null
      });
    }

    res.json({
      success: true,
      data: roadmap
    });
  } catch (error) {
    console.error('Error fetching roadmap:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

/**
 * @route POST /api/roadmap/update
 * @desc Update the user's roadmap
 */
router.post('/update', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { goal, roadmap, skills, tasks } = req.body;

    const db = await getDB();
    const collection = db.collection('user_roadmaps');

    const updatedRoadmap = {
      user_id: userId,
      goal: goal || 'Career Goal',
      roadmap: roadmap || [],
      skills: skills || [],
      tasks: tasks || [],
      updated_at: new Date()
    };

    await collection.updateOne(
      { user_id: userId },
      { $set: updatedRoadmap },
      { upsert: true }
    );

    res.json({
      success: true,
      message: 'Roadmap updated successfully',
      data: updatedRoadmap
    });
  } catch (error) {
    console.error('Error updating roadmap:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
