const express = require('express');
const router = express.Router();
const careerService = require('./career.service');

router.post('/apply', async (req, res) => {
    try {
        const app = await careerService.createApplication(req.body);
        res.status(201).json({ success: true, data: app });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const apps = await careerService.getAllApplications(req.query);
        res.status(200).json({ success: true, ...apps });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
