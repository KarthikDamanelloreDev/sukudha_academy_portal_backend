const express = require('express');
const router = express.Router();
const courseService = require('../courses/course.service');
const instructorService = require('../instructors/instructor.service');
const STATUS_CODES = require('../../utils/status-codes');

/**
 * @route   GET /api/overview
 * @desc    Get dashboard overview statistics
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const [courseStats, instructorStats] = await Promise.all([
            courseService.getCourseStats(),
            instructorService.getInstructorStats()
        ]);

        const overview = {
            // Main Dashboard Cards
            totalCourses: courseStats.totalCourses,
            totalInstructors: instructorStats.totalInstructors,
            totalTransactions: 0, // Will be implemented later
            totalRevenue: 0, // Will be implemented later

            // Detailed Course Stats
            courses: {
                total: courseStats.totalCourses,
                totalStudents: courseStats.totalStudents,
                avgRating: courseStats.avgRating,
                bestsellers: courseStats.totalBestsellers,
                freeCourses: courseStats.totalFreeCourses
            },

            // Detailed Instructor Stats
            instructors: {
                total: instructorStats.totalInstructors,
                totalCourses: instructorStats.totalCourses,
                totalStudents: instructorStats.totalStudents,
                avgRating: instructorStats.avgRating
            },

            // Summary
            summary: {
                totalCourses: courseStats.totalCourses,
                totalInstructors: instructorStats.totalInstructors,
                totalTransactions: 0, // Will be implemented later
                totalRevenue: 0, // Will be implemented later
                totalStudents: courseStats.totalStudents,
                avgCourseRating: courseStats.avgRating,
                avgInstructorRating: instructorStats.avgRating
            }
        };

        res.status(STATUS_CODES.OK).json({
            success: true,
            data: overview
        });
    } catch (error) {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
