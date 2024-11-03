const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Import the path module
const app = express();
const port = 4000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/loginDB')

// Create a schema and model with collection name specified
const userSchema = new mongoose.Schema({ username: String, password: String });
const User = mongoose.model('User', userSchema, 'loginDB'); // Specify the collection name

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve the index.html file
});

// Route to get all users (for debugging)
// app.get('/users', async (req, res) => {
//     try {
//         const users = await User.find(); // Use the User model
//         res.json(users);
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// Route to handle login (POST method)
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check for user in the database
        const user = await User.findOne({ username, password }); // For demo only, do NOT use plain text passwords in production
        if (user) {
            res.json({ success: true, message: 'Login successful!' });
        } else {
            res.json({ success: false, message: 'Invalid username or password.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
