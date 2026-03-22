const Career = require('./career.schema');

class CareerService {
    async createApplication(data) {
        data.id = `app-${Date.now()}`;
        const application = new Career(data);
        return await application.save();
    }

    async getAllApplications(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 100;
        const skip = (page - 1) * limit;

        const applications = await Career.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
        const total = await Career.countDocuments();

        return {
            data: applications,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    }
}

module.exports = new CareerService();
