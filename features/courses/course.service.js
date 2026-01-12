const Course = require('./course.schema');
const { getPaginationParams, createPaginatedResponse } = require('../../utils/pagination');
const ERROR_MESSAGES = require('../../utils/error-messages');

class CourseService {
    /**
     * Get all courses with pagination and filters
     */
    async getAllCourses(query) {
        // Build filter object
        const filter = {};
        if (query.category) filter.category = query.category;
        if (query.level) filter.level = query.level;
        if (query.instructorId) filter.instructorId = query.instructorId;
        if (query.bestseller !== undefined) filter.bestseller = query.bestseller === 'true';
        if (query.free !== undefined) filter.free = query.free === 'true';
        if (query.search) {
            filter.title = { $regex: query.search, $options: 'i' };
        }

        // Sorting
        let sort = { createdAt: -1 };
        if (query.sortBy) {
            switch (query.sortBy) {
                case 'rating':
                    sort = { rating: -1 };
                    break;
                case 'newest':
                    sort = { createdAt: -1 };
                    break;
                case 'price-low':
                    sort = { price: 1 };
                    break;
                case 'price-high':
                    sort = { price: -1 };
                    break;
                case 'popular':
                    sort = { students: -1 };
                    break;
            }
        }

        const [courses, total] = await Promise.all([
            Course.find(filter).sort(sort),
            Course.countDocuments(filter)
        ]);

        return { data: courses, total, success: true };
    }

    /**
     * Get course by ID
     */
    async getCourseById(id) {
        const course = await Course.findOne({ id });
        if (!course) {
            throw new Error(ERROR_MESSAGES.COURSE_NOT_FOUND);
        }
        return course;
    }

    /**
     * Create new course
     */
    async createCourse(courseData) {
        // Check if course with same ID already exists
        const existingCourse = await Course.findOne({ id: courseData.id });
        if (existingCourse) {
            throw new Error(ERROR_MESSAGES.COURSE_ALREADY_EXISTS);
        }

        const course = new Course(courseData);
        await course.save();
        return course;
    }

    /**
     * Update course
     */
    async updateCourse(id, updateData) {
        const course = await Course.findOneAndUpdate(
            { id },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!course) {
            throw new Error(ERROR_MESSAGES.COURSE_NOT_FOUND);
        }

        return course;
    }

    /**
     * Delete course
     */
    async deleteCourse(id) {
        const course = await Course.findOneAndDelete({ id });
        if (!course) {
            throw new Error(ERROR_MESSAGES.COURSE_NOT_FOUND);
        }
        return course;
    }

    /**
     * Get course statistics
     */
    async getCourseStats() {
        const stats = await Course.aggregate([
            {
                $group: {
                    _id: null,
                    totalCourses: { $sum: 1 },
                    totalStudents: { $sum: '$students' },
                    avgRating: { $avg: '$rating' },
                    totalBestsellers: {
                        $sum: { $cond: ['$bestseller', 1, 0] }
                    },
                    totalFreeCourses: {
                        $sum: { $cond: ['$free', 1, 0] }
                    }
                }
            }
        ]);

        return stats[0] || {
            totalCourses: 0,
            totalStudents: 0,
            avgRating: 0,
            totalBestsellers: 0,
            totalFreeCourses: 0
        };
    }
}

module.exports = new CourseService();
