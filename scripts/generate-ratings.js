const fs = require('fs');
const path = require('path');

const tsFilePath = path.join(__dirname, '../../SUKUDHA-ACADEMY-FRONTEND/src/data/courses.ts');

function generateDistribution(rating) {
    // Ensure rating is a number
    const r = parseFloat(rating) || 4.0;

    let p5, p4, p3, p2, p1;

    // Simulate realistic curve based on rating
    if (r >= 4.6) {
        p5 = 70; p4 = 20; p3 = 5; p2 = 3; p1 = 2;
        // Jitter
        p5 += Math.floor(Math.random() * 10 - 5);
        p4 += Math.floor(Math.random() * 6 - 3);
    } else if (r >= 4.0) {
        p5 = 50; p4 = 30; p3 = 10; p2 = 5; p1 = 5;
        // Jitter
        p5 += Math.floor(Math.random() * 10 - 5);
        p4 += Math.floor(Math.random() * 10 - 5);
    } else if (r >= 3.0) {
        p5 = 30; p4 = 30; p3 = 20; p2 = 10; p1 = 10;
        p5 += Math.floor(Math.random() * 10 - 5);
    } else {
        p5 = 10; p4 = 20; p3 = 30; p2 = 20; p1 = 20;
    }

    // Recalculate remainders to ensure sum 100
    // We'll trust the random jitter didn't break it too much, but let's normalize.
    let sum = p5 + p4 + p3 + p2 + p1;
    let diff = 100 - sum;

    // Add diff to the largest chunk to be subtlest
    if (p5 >= p4) p5 += diff;
    else p4 += diff;

    return [
        { "rating": 5, "percentage": p5 },
        { "rating": 4, "percentage": p4 },
        { "rating": 3, "percentage": p3 },
        { "rating": 2, "percentage": p2 },
        { "rating": 1, "percentage": p1 }
    ];
}

const updateCourses = () => {
    console.log('Reading courses.ts...');
    const content = fs.readFileSync(tsFilePath, 'utf8');

    const startMarker = 'export const courses: Course[] =';
    const startIndex = content.indexOf(startMarker);

    if (startIndex === -1) {
        console.error('Could not find courses array in TS file');
        return;
    }

    // Extract relevant parts
    const preContent = content.substring(0, startIndex + startMarker.length);
    let dataPart = content.substring(startIndex + startMarker.length).trim();

    // We expect ending with ];
    const lastBracketIndex = dataPart.lastIndexOf('];');
    if (lastBracketIndex === -1) {
        console.error('Cannot find closing bracket');
        return;
    }

    const arrayStr = dataPart.substring(0, lastBracketIndex + 1);
    const postContent = dataPart.substring(lastBracketIndex + 2);

    let courses;
    try {
        // Evaluate the string as JS code
        courses = eval(arrayStr);
    } catch (e) {
        console.error('Error parsing courses:', e);
    }

    if (!courses || !Array.isArray(courses)) {
        console.error('Parsed content is not an array');
        return;
    }

    console.log(`Processing ${courses.length} courses...`);
    let updatedCount = 0;

    courses.forEach(course => {
        // Always regenerate or ensure it exists.
        // The user complained about 0%, so let's overwrite or fill if missing/bad.
        if (!course.ratingDistribution || course.ratingDistribution.length === 0 || course.ratingDistribution.every(d => d.percentage === 0)) {
            course.ratingDistribution = generateDistribution(course.rating);
            updatedCount++;
        }
    });

    console.log(`Updated rating distributions for ${updatedCount} courses.`);

    // Convert back to string
    const jsonString = JSON.stringify(courses, null, 2);

    const finalContent = `${preContent} ${jsonString};\n${postContent}`;

    fs.writeFileSync(tsFilePath, finalContent);
    console.log('Done writing courses.ts');
};

updateCourses();
