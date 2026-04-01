require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Charity = require('./models/Charity');

const updateCharities = async () => {
    try {
        await connectDB();
        
        const updates = [
            { name: 'Wildlife Conservation Trust', logoUrl: 'http://localhost:5000/uploads/charities/wildlife_logo.png' },
            { name: 'Global Education Fund', logoUrl: 'http://localhost:5000/uploads/charities/education_logo.png' },
            { name: 'Clean Oceans Initiative', logoUrl: 'http://localhost:5000/uploads/charities/oceans_logo.png' },
            { name: 'Junior Golf Foundation', logoUrl: 'http://localhost:5000/uploads/charities/golf_foundation_logo.png' }
        ];

        for (const update of updates) {
            const charity = await Charity.findOne({ name: update.name });
            if (charity) {
                charity.logoUrl = update.logoUrl;
                await charity.save();
                console.log(`Updated ${update.name}`);
            } else {
                console.log(`Charity not found: ${update.name}`);
            }
        }

        console.log('Update complete');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

updateCharities();
