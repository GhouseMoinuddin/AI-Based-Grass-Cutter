const router = require('express').Router();
const Record = require('../models/Record');

// GET ALL RECORDS
router.get('/', async (req, res) => {
    try {
        const records = await Record.find().sort({ timestamp: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET TRENDS (Analytics)
router.get('/trends', async (req, res) => {
    try {
        const totalSessions = await Record.countDocuments();

        // Total Runtime
        const runtimeAgg = await Record.aggregate([
            { $group: { _id: null, total: { $sum: '$duration' } } }
        ]);
        const totalRuntime = runtimeAgg[0]?.total || 0;

        // Most Frequent Pattern
        const freqAgg = await Record.aggregate([
            { $group: { _id: '$value', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);
        const favoritePattern = freqAgg[0]?._id || 'N/A';

        res.json({
            totalSessions,
            totalRuntime,
            favoritePattern
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SAVE NEW RECORD
router.post('/', async (req, res) => {
    try {
        const newRecord = new Record(req.body);
        const savedRecord = await newRecord.save();
        res.status(201).json(savedRecord);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
