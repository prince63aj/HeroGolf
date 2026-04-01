require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const users = [
    { name: 'Tiger Woods', email: 'tiger@golf.com', password: 'password123', role: 'subscriber', subscription: { status: 'active', plan: 'yearly' }, drawNumbers: [5, 12, 23, 34, 45] },
    { name: 'Rory McIlroy', email: 'rory@golf.com', password: 'password123', role: 'subscriber', subscription: { status: 'active', plan: 'monthly' }, drawNumbers: [1, 2, 3, 4, 5] },
    { name: 'Scottie Scheffler', email: 'scottie@golf.com', password: 'password123', role: 'subscriber', subscription: { status: 'active', plan: 'yearly' }, drawNumbers: [10, 20, 30, 40, 50] },
    { name: 'Jon Rahm', email: 'jon@golf.com', password: 'password123', role: 'subscriber', subscription: { status: 'active', plan: 'monthly' }, drawNumbers: [7, 14, 21, 28, 35] },
    { name: 'Viktor Hovland', email: 'viktor@golf.com', password: 'password123', role: 'subscriber', subscription: { status: 'active', plan: 'yearly' }, drawNumbers: [12, 24, 36, 48, 5] }
];

const seedUsers = async () => {
    try {
        await connectDB();
        await User.deleteMany(); // Clear existing users
        for (const u of users) {
            const user = new User(u);
            await user.save();
            console.log(`Created user: ${user.name}`);
        }
        console.log('Seeding complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedUsers();
