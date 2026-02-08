import moongose from 'mongoose';

const connectDB = async () => {
    try {
        await moongose.connect('mongodb://localhost:27017/pokemon');
        console.log('Connected to MongoDB successfully.');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

connectDB()