// Run npm i since I added a .gitignore file
// Then run nodemon app.js and open http://localhost:3000 in your browser

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import imageRoutes from './routes/images.js';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB Connected");
    } catch (err) {
        console.log("DB Connection Error: ", err);
    }
};

// Connect to the database
connectDB();

// Parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the image routes
app.use('/images', imageRoutes);

app.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on port ${port}`);
});