const Instructor = require('./instructor.schema');
const ERROR_MESSAGES = require('../../utils/error-messages');

class InstructorService {
    async getAllInstructors(query) {
        const filter = {};
        if (query.role) filter.role = query.role;
        if (query.search) {
            filter.name = { $regex: query.search, $options: 'i' };
        }

        const [instructors, total] = await Promise.all([
            Instructor.find(filter).sort({ createdAt: -1 }),
            Instructor.countDocuments(filter)
        ]);

        return { data: instructors, total, success: true };
    }

    async getInstructorById(id) {
        const instructor = await Instructor.findOne({ id });
        if (!instructor) {
            throw new Error(ERROR_MESSAGES.INSTRUCTOR_NOT_FOUND);
        }
        return instructor;
    }

    async createInstructor(instructorData) {
        const existingInstructor = await Instructor.findOne({ id: instructorData.id });
        if (existingInstructor) {
            throw new Error(ERROR_MESSAGES.INSTRUCTOR_ALREADY_EXISTS);
        }

        const instructor = new Instructor(instructorData);
        await instructor.save();
        return instructor;
    }

    async updateInstructor(id, updateData) {
        const instructor = await Instructor.findOneAndUpdate(
            { id },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!instructor) {
            throw new Error(ERROR_MESSAGES.INSTRUCTOR_NOT_FOUND);
        }

        return instructor;
    }

    async deleteInstructor(id) {
        const instructor = await Instructor.findOneAndDelete({ id });
        if (!instructor) {
            throw new Error(ERROR_MESSAGES.INSTRUCTOR_NOT_FOUND);
        }
        return instructor;
    }

    async getInstructorStats() {
        const stats = await Instructor.aggregate([
            {
                $group: {
                    _id: null,
                    totalInstructors: { $sum: 1 },
                    totalCourses: { $sum: '$courses' },
                    totalStudents: { $sum: '$students' },
                    avgRating: { $avg: '$rating' }
                }
            }
        ]);

        return stats[0] || {
            totalInstructors: 0,
            totalCourses: 0,
            totalStudents: 0,
            avgRating: 0
        };
    }
}

module.exports = new InstructorService();
