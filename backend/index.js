const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const axios = require('axios'); // To call the Python service
require('dotenv').config();

const app = express();
app.use(express.json());

// --- Database Connection ---
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'careerpulse'
};

// --- API Routes ---

// 1. User Signup
app.post('/api/signup', async (req, res) => {
    const { fullName, email, password, userType, college, stream, skills } = req.body;

    if (!fullName || !email || !password || !userType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // Check if user already exists
        const [existingUsers] = await connection.execute('SELECT email FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert into users table
        const [userResult] = await connection.execute(
            'INSERT INTO users (fullName, email, password, userType) VALUES (?, ?, ?, ?)',
            [fullName, email, hashedPassword, userType]
        );
        const userId = userResult.insertId;
        
        // Insert into profiles table
        await connection.execute(
            'INSERT INTO profiles (userId, college, stream, interestedSkills) VALUES (?, ?, ?, ?)',
            [userId, college, stream, skills.join(',')]
        );
        
        await connection.end();
        res.status(201).json({ message: 'User created successfully', userId });

    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// 2. Get Career Suggestion (integrates with Python service)
app.get('/api/users/:userId/suggestion', async (req, res) => {
    const { userId } = req.params;
    
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        // Fetch user data needed for the model
        const [users] = await connection.execute('SELECT userType FROM users WHERE id = ?', [userId]);
        // In a real app, you would also fetch assessment answers to derive 'interest' and 'skill_interest'
        
        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const userDataForModel = {
            userType: users[0].userType,
            interest: 'building', // This should be dynamically determined from assessment responses
            skill_interest: 'technical' // This should also be dynamic
        };

        // Call the Python ML Service
        const mlServiceResponse = await axios.post('http://localhost:5000/predict', userDataForModel);
        
        const { predicted_career_path } = mlServiceResponse.data;

        // Save the suggestion to the user's profile
        await connection.execute(
            'UPDATE profiles SET suggestedCareerPath = ? WHERE userId = ?',
            [predicted_career_path, userId]
        );

        await connection.end();
        res.json({ suggestedCareerPath: predicted_career_path });

    } catch (error) {
        console.error('Suggestion Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to get career suggestion' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node.js server running on http://localhost:${PORT}`);
});