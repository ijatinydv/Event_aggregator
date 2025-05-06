const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Route to get all events with optional filtering
router.get('/', eventController.getEvents);

// Route to create a new event
router.post('/', eventController.createEvent);

// Route to get a single event by ID
router.get('/:id', eventController.getEventById);

module.exports = router; 