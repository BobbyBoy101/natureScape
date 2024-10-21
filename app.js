// Run npm i since I added a .gitignore file
// Then run nodemon app.js and open http://localhost:3000 in your browser

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import imageRoutes from './routes/images.js';
import exphbs from 'express-handlebars';

const app = express();
const port = 3000;

// Set up express and handlebars
app.use('/public', express.static('public')); // Serve static files from 'public' dir
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded requests
app.use(express.json()); // Parse JSON requests (lets you use 'req.body')
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' })); // Set up default layout for handlebars
app.set('view engine', 'handlebars'); // Set view engine to handlebars

// Serve static files from the "public" directory
app.get('/', (req, res) => {
    res.render('index');
});

// Use the image routes
app.use('/images', imageRoutes);

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

app.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on port ${port}`);
});