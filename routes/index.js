const express = require('express');
const router = express.Router();

// Import feature routes
const authRoutes = require('../features/auth/auth.routes');
const courseRoutes = require('../features/courses/course.routes');
const instructorRoutes = require('../features/instructors/instructor.routes');
const contactInfoRoutes = require('../features/contact-info/contact-info.routes');
const overviewRoutes = require('../features/overview/overview.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/instructors', instructorRoutes);
router.use('/contact-info', contactInfoRoutes);
router.use('/overview', overviewRoutes);

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

// Root route
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Sukudha Academy API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            courses: '/api/courses',
            instructors: '/api/instructors',
            contactInfo: '/api/contact-info',
            overview: '/api/overview',
            health: '/api/health',
            docs: '/api-docs'
        }
    });
});

module.exports = router;
