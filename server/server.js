const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const Event = require('./models/Event');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);

// Load mock data if database is empty
const loadMockData = async () => {
  try {
    const count = await Event.countDocuments();
    if (count === 0) {
      const mockData = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'data', 'mockEvents.json'), 'utf-8')
      );
      await Event.insertMany(mockData);
      console.log('Mock data loaded successfully');
    }
  } catch (error) {
    console.error('Error loading mock data:', error);
  }
};

// Call function to load mock data
loadMockData();

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
}); 