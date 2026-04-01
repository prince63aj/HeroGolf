require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Charity = require('./models/Charity');

const listCharities = async () => {
    try {
        await connectDB();
        const charities = await Charity.find();
        console.log(JSON.stringify(charities, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listCharities();
