import express from 'express';
import Image from '../model.js';
import exifParser from 'exif-parser';
//import { Image } from '../config/mongoCollections.js';
//import { ObjectId } from 'mongodb';

const router = express.Router();

// Route to fetch all images
router.get('/', async (req, res) => {
    try {
        const images = await Image.find({});
        const formattedImages = images.map(image => ({
            _id: image._id,
            name: image.name,
            desc: image.desc,
            img: {
                data: image.img.data.toString('base64'),
                contentType: image.img.contentType
            }
        }));
        res.json(formattedImages);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving images");
    }
});

// Route to display a specific photo
router.get('/photo/:id', async (req, res) => {
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
});

// Route to upload an image
router.post('/upload', async (req, res) => {
    const maxUploadSize = 16 * 1024 * 1024; // 16MB

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    if (req.files.image.size > maxUploadSize) {
        return res.status(400).send(`Photo size must be less than ${maxUploadSize}`);
    }
req.files.buff
    const { name, desc } = req.body;
    const imageFile = req.files.image;

    // Extract metadata from photo
    const parser = exifParser.create(imageFile.data);
    const metadata = parser.parse();

    // Create a new image document
    const newImage = new Image({
        name: name,
        desc: desc,
        img: {
            data: imageFile.data,
            contentType: imageFile.mimetype
        },
        metadata: metadata.tags
    });

    try {
        await newImage.save();
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Route to delete an image by ID
router.delete('/:id', async (req, res) => {
    try {
        const result = await Image.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).send("Image not found");
        }
        res.status(200).send("Image deleted successfully");
    } catch (err) {
        console.log(err);
        res.status(500).send("Error deleting image");
    }
});

export default router;