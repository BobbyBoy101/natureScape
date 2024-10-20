import express from 'express';
import multer from 'multer';
import Image from '../model.js';

const router = express.Router();

// Multer setup for file uploads (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Route to fetch a single image by ID
router.get('/:id', async (req, res) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
            return res.status(404).send("Image not found");
        }
        const formattedImage = {
            _id: image._id,
            name: image.name,
            desc: image.desc,
            img: {
                data: image.img.data.toString('base64'),
                contentType: image.img.contentType
            }
        };
        res.json(formattedImage);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error retrieving image");
    }
});

// Route to upload a new image
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const obj = {
            name: req.body.name,
            desc: req.body.desc,
            img: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        };

        await Image.create(obj);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send("Error uploading image");
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