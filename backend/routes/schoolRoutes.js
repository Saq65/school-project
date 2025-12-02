const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const schoolController = require('../controller/schoolController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/schoolImages/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'school-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

// Validation rules
const schoolValidation = [
    body('name').trim().notEmpty().withMessage('School name is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('state').trim().notEmpty().withMessage('State is required'),
    body('contact').trim().matches(/^[0-9]{10}$/).withMessage('Contact must be a valid 10-digit number'),
    body('email_id').isEmail().withMessage('Valid email is required')
];

// Routes
router.post('/', upload.single('image'), schoolValidation, schoolController.addSchool);
router.get('/', schoolController.getAllSchools);
router.get('/:id', schoolController.getSchoolById);
router.delete('/:id', schoolController.deleteSchool);

module.exports = router;