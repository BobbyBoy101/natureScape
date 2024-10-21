// Run npm i since I added a .gitignore file
// Then run nodemon app.js and open http://localhost:3000 in your browser

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import imageRoutes from './routes/images.js';
import exphbs from 'express-handlebars';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Parse request bodies
app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



// Serve static files from the "public" directory
//app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.render('index');
}); 

// Use the image routes
app.use('/images', imageRoutes);

/* app.get('/images/:id', (req, res) => {
    res.render('image');
}); */
/* app.get('/images', (req, res) => {
    res.render('image');
}); */
// app.get('/images/:id', (req, res) => {
//     res.render('image');
// });
// Route to display a specific photo
/* app.get('/photo/:id', async (req, res) => {
    const photoId = req.params.id;
    try {
        const photoData = await Image.findById(photoId);
        if (!photoData) {
            return res.status(404).send('Photo not found');
        }
        const base64Image = photoData.img.data.toString('base64');
        res.render('image', { 
            photo: {
                ...photoData.toObject(),
                img: {
                    contentType: photoData.img.contentType,
                    data: base64Image
                }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}); */

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