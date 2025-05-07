# Event Aggregator Web App

A full-stack web application for aggregating and displaying tech events such as hackathons, workshops, and tech talks.

## Features

- Browse upcoming tech events with details (name, date, type, college, location, description, and link)
- Filter events by date, type, location, and college
- Submit new events through a user-friendly form
- Responsive design for desktop and mobile devices
- Optional scraping logic (mocked with JSON data)

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router for navigation
- Axios for API requests
- React DatePicker for date inputs

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Cors for cross-origin requests
- Dotenv for environment variables

## Project Structure

```
/event-aggregator
  /client           # React frontend
  /server           # Node.js backend
  .env.example      # Example environment variables
  README.md         # Project documentation
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/event-aggregator.git
cd event-aggregator
```

2. Install dependencies for the project, server, and client
```bash
npm run install-all
```

3. Set up environment variables
```bash
cp .env.example .env
```
Then edit the `.env` file with your MongoDB URI and other configuration.

4. Start the development server
```bash
npm run dev
```
This will run both the client (on port 3000) and server (on port 5000) concurrently.

## API Endpoints

- `GET /api/events` - Get all events with optional filters
- `POST /api/events` - Create a new event
- `GET /api/events/:id` - Get a single event by ID

## Submission Contact Info

- GitHub: https://github.com/ijatinydv/
- Telegram: @jd_ydv_777
- Twitter: @Jatin_kumar27
- Contact Number: +91 9785525236

## License

MIT 
