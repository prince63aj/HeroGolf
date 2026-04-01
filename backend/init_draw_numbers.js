require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

const getRandomNumbers = (count, min, max) => {
    const nums = new Set();
    while (nums.size < count) {
        nums.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(nums).sort((a, b) => a - b);
};

const initDrawNumbers = async () => {
    try {
        await connectDB();
        const users = await User.find({ drawNumbers: { $size: 0 } });
        console.log(`Found ${users.length} users with no draw numbers.`);

        for (const user of users) {
            user.drawNumbers = getRandomNumbers(5, 1, 50);
            await user.save();
            console.log(`Assigned ${user.drawNumbers} to ${user.email}`);
        }

        const allUsers = await User.find();
        for (const user of allUsers) {
            if (!user.drawNumbers || user.drawNumbers.length === 0) {
               user.drawNumbers = getRandomNumbers(5, 1, 50);
               await user.save();
               console.log(`Fixed/Assigned ${user.drawNumbers} to ${user.email}`);
            }
        }

        console.log('Migration complete.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

initDrawNumbers();
