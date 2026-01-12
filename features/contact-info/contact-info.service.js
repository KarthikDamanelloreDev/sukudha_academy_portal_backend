const ContactInfo = require('./contact-info.schema');
const ERROR_MESSAGES = require('../../utils/error-messages');

class ContactInfoService {
    async getContactInfo() {
        let contactInfo = await ContactInfo.findOne();

        // If no contact info exists, create default one
        if (!contactInfo) {
            contactInfo = await ContactInfo.create({
                companyName: 'SukudhaEdu',
                companyLegalName: 'SUKUDHA SOFTWARE SOLUTIONS PRIVATE LIMITED',
                description: 'At SukudhaEdu, (SUKUDHA SOFTWARE SOLUTIONS PRIVATE LIMITED) offers smart, career-aligned online learning designed to help you rise. Gain the skills you need and the confidence you deserve.',
                email: 'Info@sukudhaedu.com',
                phone: '8886648491',
                phoneLabel: 'Helpline',
                phone2: '8886648492',
                phone2Label: 'Customer Care',
                address: '6-13-14A, 13/3 Arundelpet',
                floor: 'Ground Floor',
                city: 'Guntur',
                state: 'Andhra Pradesh',
                zip: '522002',
                supportEmail: 'support@sukudhaedu.com',
                salesEmail: 'Info@sukudhaedu.com',
                officeHours: {
                    weekdays: 'Mon - Sat: 9:00 AM - 7:00 PM',
                    weekend: 'Sunday: Closed'
                }
            });
        }

        return contactInfo;
    }

    async updateContactInfo(updateData) {
        let contactInfo = await ContactInfo.findOne();

        if (!contactInfo) {
            // Create if doesn't exist
            contactInfo = await ContactInfo.create(updateData);
        } else {
            // Update existing
            contactInfo = await ContactInfo.findByIdAndUpdate(
                contactInfo._id,
                { $set: updateData },
                { new: true, runValidators: true }
            );
        }

        return contactInfo;
    }
}

module.exports = new ContactInfoService();
