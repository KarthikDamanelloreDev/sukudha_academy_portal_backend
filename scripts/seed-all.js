require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../features/courses/course.schema');
const Instructor = require('../features/instructors/instructor.schema');
const ContactInfo = require('../features/contact-info/contact-info.schema');

const coursesData = require('../data-seed/courses');
const instructorsData = require('../data-seed/instructors');
const contactInfoData = require('../data-seed/contact-info');

const seedAll = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB...');

        // 1. Seed Instructors
        console.log('Clearing existing instructors...');
        await Instructor.deleteMany({});
        console.log('Seeding instructors...');
        await Instructor.insertMany(instructorsData);
        console.log(`Successfully seeded ${instructorsData.length} instructors.`);

        // 2. Seed Courses
        console.log('Clearing existing courses...');
        await Course.deleteMany({});
        console.log('Seeding courses...');
        // Insert in chunks if needed, but 161 should be fine in one go
        await Course.insertMany(coursesData);
        console.log(`Successfully seeded ${coursesData.length} courses.`);

        // 3. Seed Contact Info
        console.log('Clearing existing contact info...');
        await ContactInfo.deleteMany({});
        console.log('Seeding contact info...');
        await ContactInfo.create(contactInfoData);
        console.log('Successfully seeded contact info.');

        console.log('All data seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedAll();
