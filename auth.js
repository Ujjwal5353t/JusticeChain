const express = require('express');
const bcrypt = require('bcryptjs');
const Citizen = require('../models/citizen');
const Admin = require('../models/admin');
const router = express.Router();

// Citizen Register
router.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new Citizen({ username: req.body.username, password: hashedPassword });
        await newUser.save();
        res.json({ message: 'Citizen registered successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Citizen Login
router.post('/login', async (req, res) => {
    try {
        const user = await Citizen.findOne({ username: req.body.username });
        if (!user) return res.status(404).json({ message: 'Citizen not found' });

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        res.json({ message: 'Citizen logged in successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Admin Register
router.post('/admin/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newAdmin = new Admin({ username: req.body.username, password: hashedPassword });
        await newAdmin.save();
        res.json({ message: 'Admin registered successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: req.body.username });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const isMatch = await bcrypt.compare(req.body.password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

        res.json({ message: 'Admin logged in successfully' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
