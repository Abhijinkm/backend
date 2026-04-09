const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const URI = process.env.MONGO_URI || 'mongodb+srv://abhijinkm35_db:qZIBoeh0FZVyvWzW@cluster0.yadyo6s.mongodb.net/mydb?retryWrites=true&w=majority';
        const conn = await mongoose.connect(URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
