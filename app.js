// Run npm i since I added a .gitignore file
// Then run nodemon app.js and open http://localhost:3000 in your browser

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import imageRoutes from './routes/images.js';
import exphbs from 'express-handlebars';
import fileUpload from 'express-fileupload'; 

const app = express();
const port = 3000;

// Set up express
app.use('/public', express.static('public')); // Serve static files from 'public' dir
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded requests
app.use(express.json()); // Parse JSON requests (lets you use 'req.body')
app.use(fileUpload(
    {
        // Set file size limit to 16MB
        limits: { fileSize: 16 * 1024 * 1024 }, // 16MB file limit
        abortOnLimit: true,
        responseOnLimit: "Photo size must be less than 16MB"
    }
));
app.use('/images', imageRoutes);

// Set up default layout and view engine for handlebars
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' })); 
app.set('view engine', 'handlebars');

// Serve static file before connecting to the DB
app.get('/', (req, res) => {
    res.render('index');
});

// Get variables from .env file
dotenv.config();

// Function to connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        //await mongoose.connection.dropDatabase();
        console.log("DB Connected");
    } catch (err) {
        console.log("DB Connection Error: ", err);
    }
};

// Call the connectDB function
connectDB();

app.listen(port, err => {
    if (err) throw err;
    console.log(`Server listening on port ${port}`);
});