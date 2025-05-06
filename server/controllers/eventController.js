const Event = require('../models/Event');

// Get all events with optional filtering
exports.getEvents = async (req, res) => {
  try {
    const { 
      type, 
      college, 
      location, 
      startDate, 
      endDate 
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (type) filter.type = type;
    if (college) filter.college = { $regex: college, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    
    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    
    // Create new event
    const event = new Event(eventData);
    const savedEvent = await event.save();
    
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error(err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}; 