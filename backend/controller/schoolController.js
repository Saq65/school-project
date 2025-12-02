const db = require('../config/database');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../uploads/schoolImages');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

exports.addSchool = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ 
                success: false, 
                errors: errors.array() 
            });
        }

        const { name, address, city, state, contact, email_id } = req.body;
        const image = req.file ? `/uploads/schoolImages/${req.file.filename}` : null;

        const query = `
            INSERT INTO schools (name, address, city, state, contact, image, email_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.execute(query, [
            name, address, city, state, contact, image, email_id
        ]);

        res.status(201).json({
            success: true,
            message: 'School added successfully',
            schoolId: result.insertId
        });

    } catch (error) {
        console.error('Error adding school:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error adding school',
            error: error.message 
        });
    }
};

exports.getAllSchools = async (req, res) => {
    try {
        const query = 'SELECT id, name, address, city, state, image FROM schools ORDER BY created_at DESC';
        const [schools] = await db.execute(query);

        res.json({
            success: true,
            count: schools.length,
            schools: schools
        });

    } catch (error) {
        console.error('Error fetching schools:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching schools',
            error: error.message 
        });
    }
};

exports.getSchoolById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM schools WHERE id = ?';
        const [schools] = await db.execute(query, [id]);

        if (schools.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'School not found' 
            });
        }

        res.json({
            success: true,
            school: schools[0]
        });

    } catch (error) {
        console.error('Error fetching school:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching school',
            error: error.message 
        });
    }
};

exports.deleteSchool = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [schools] = await db.execute('SELECT image FROM schools WHERE id = ?', [id]);
        
        if (schools.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'School not found' 
            });
        }

        const [result] = await db.execute('DELETE FROM schools WHERE id = ?', [id]);

        if (schools[0].image) {
            const imagePath = path.join(__dirname, '..', schools[0].image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.json({
            success: true,
            message: 'School deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting school:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error deleting school',
            error: error.message 
        });
    }
};