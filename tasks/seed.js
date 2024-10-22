import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Image from '../model.js'; // Adjust the path as necessary

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB Connected');
    } catch (err) {
        console.error('DB Connection Error:', err);
    }
};

const dropDatabase = async () => {
    try {
        await mongoose.connection.dropDatabase();
        console.log('Database dropped');
    } catch (err) {
        console.error('Error dropping database:', err);
    }
};

const seedImages = async () => {
    const imageFolder = path.join(__dirname, '../seed_images'); // Adjust the path as necessary
    const imageFiles = fs.readdirSync(imageFolder);

    for (const file of imageFiles) {
        const filePath = path.join(imageFolder, file);
        const fileExtension = path.extname(file).toLowerCase();

        // Filter out non-image files like .DS_Store >_<
        if (!['.jpg', '.jpeg', '.png', '.heic'].includes(fileExtension)) {
            console.log(`Non-image file ${file} found, skipping...`);
            continue;
        }

        const fileData = fs.readFileSync(filePath);
        const contentType = 'image/' + fileExtension.slice(1);

        const newImage = new Image({
            name: path.basename(file, fileExtension),
            desc: 'Seed image',
            img: {
                data: fileData,
                contentType: contentType,
            },
        });

        try {
            await newImage.save();
            console.log(`Image ${file} saved to database`);
        } catch (err) {
            console.error(`Error saving image ${file}:`, err);
        }
    }
};

const runSeed = async () => {
    await connectDB();
    await dropDatabase();
    await seedImages();
    mongoose.connection.close();
};

runSeed();