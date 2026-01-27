const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        res.status(201).json({ userId: savedUser._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Check pass
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: 'Invalid password' });

        // Token
        // Ideally use process.env.JWT_SECRET, defaulting to 'secret' for dev if missing (but should confirm .env)
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'dev_secret_key');
        res.header('auth-token', token).json({ token, userId: user._id });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
