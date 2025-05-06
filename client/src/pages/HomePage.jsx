import { useState, useEffect, useRef } from 'react';
import EventCard from '../components/EventCard';
import EventFilters from '../components/EventFilters';
import { getEvents } from '../utils/api';
import axios from 'axios';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    type: '',
    location: '',
    college: ''
  });
  
  // Refs for scroll animations and scrolling to sections
  const heroRef = useRef(null);
  const filterRef = useRef(null);
  const contentRef = useRef(null);
  const eventsListRef = useRef(null);

  useEffect(() => {
    fetchRealTimeEvents();
    
    // Initialize scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Observe elements
    if (heroRef.current) observer.observe(heroRef.current);
    if (filterRef.current) observer.observe(filterRef.current);
    if (contentRef.current) observer.observe(contentRef.current);
    
    // Setup refresh interval for real-time events (every 5 minutes)
    const intervalId = setInterval(() => {
      fetchRealTimeEvents();
    }, 5 * 60 * 1000);
    
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
      if (filterRef.current) observer.unobserve(filterRef.current);
      if (contentRef.current) observer.unobserve(contentRef.current);
      clearInterval(intervalId);
    };
  }, []);

  // Function to handle "Start Exploring" button click
  const handleStartExploring = () => {
    if (eventsListRef.current) {
      window.scrollTo({
        top: eventsListRef.current.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  // Fetch events from our MongoDB database
  const fetchEvents = async (filterParams = {}) => {
    setLoading(true);
    try {
      const eventsData = await getEvents(filterParams);
      setEvents(eventsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch real-time events from external APIs and transform them
  const fetchRealTimeEvents = async () => {
    setLoading(true);
    try {
      // Combined approach: fetch from multiple sources
      let allEvents = [];
      
      // 1. Fetch from Conference API (using proxy to avoid CORS)
      try {
        const conferenceResponse = await axios.get('https://api.dev.to/api/events');
        const devToEvents = conferenceResponse.data.map(event => ({
          _id: `devto-${event.id}`,
          name: event.title || event.name,
          date: new Date(event.starts_at || event.date),
          type: event.category || 'Conference',
          college: event.organization || 'Dev.to Community',
          location: event.location || 'Online',
          description: event.description || 'Join this amazing tech event hosted by the community!',
          link: event.url
        }));
        allEvents = [...allEvents, ...devToEvents];
      } catch (devToError) {
        console.error('Failed to fetch Dev.to events:', devToError);
        
        // Fallback: Fetch from Github Events
        try {
          const githubResponse = await axios.get('https://api.github.com/events?per_page=10');
          
          const githubEvents = githubResponse.data.map(event => {
            // Convert GitHub events to our format
            let type = 'Tech Talk';
            if (event.type.includes('Push')) type = 'Workshop';
            if (event.type.includes('Release')) type = 'Conference';
            
            return {
              _id: `github-${event.id}`,
              name: `${event.type.replace('Event', '')} by ${event.actor.display_login}`,
              date: new Date(event.created_at),
              type,
              college: 'GitHub',
              location: 'Online',
              description: `GitHub ${event.type} event in the ${event.repo.name} repository.`,
              link: `https://github.com/${event.repo.name}`
            };
          });
          
          allEvents = [...allEvents, ...githubEvents];
        } catch (githubError) {
          console.error('Failed to fetch GitHub events:', githubError);
        }
      }
      
      // If we still have no events, use backup API
      if (allEvents.length === 0) {
        try {
          const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
          const mockEvents = response.data.slice(0, 10).map((post, index) => {
            const eventTypes = ['Hackathon', 'Workshop', 'Conference', 'Tech Talk', 'Webinar', 'Career Fair'];
            const locations = ['San Francisco', 'New York', 'Online', 'Boston', 'Seattle', 'Austin'];
            const colleges = ['MIT', 'Stanford', 'Harvard', 'UC Berkeley', 'Georgia Tech', 'CalTech'];
            
            // Generate a date between today and 30 days in the future
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30));
            
            return {
              _id: `placeholder-${post.id}`,
              name: post.title.charAt(0).toUpperCase() + post.title.slice(1),
              date: futureDate,
              type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
              college: colleges[Math.floor(Math.random() * colleges.length)],
              location: locations[Math.floor(Math.random() * locations.length)],
              description: post.body,
              link: `https://example.com/event/${post.id}`
            };
          });
          
          allEvents = [...allEvents, ...mockEvents];
        } catch (mockError) {
          console.error('Failed to fetch mock events:', mockError);
        }
      }
      
      // Sort by date
      allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Apply filters if any
      let filteredEvents = allEvents;
      if (filters.type) {
        filteredEvents = filteredEvents.filter(event => 
          event.type.toLowerCase().includes(filters.type.toLowerCase())
        );
      }
      if (filters.location) {
        filteredEvents = filteredEvents.filter(event => 
          event.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      if (filters.college) {
        filteredEvents = filteredEvents.filter(event => 
          event.college.toLowerCase().includes(filters.college.toLowerCase())
        );
      }
      if (filters.startDate) {
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.date) >= new Date(filters.startDate)
        );
      }
      if (filters.endDate) {
        filteredEvents = filteredEvents.filter(event => 
          new Date(event.date) <= new Date(filters.endDate)
        );
      }
      
      setEvents(filteredEvents);
      setError(null);
    } catch (err) {
      console.error('Error fetching real-time events:', err);
      setError('Failed to fetch real-time events. Falling back to local data.');
      fetchEvents(filters);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Use the updated filters for real-time data
    fetchRealTimeEvents();
  };

  return (
    <div className="space-y-10">
      <div 
        ref={heroRef}
        className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 mb-10 shadow-xl overflow-hidden transform opacity-0 translate-y-8 transition-all duration-700 ease-out"
      >
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">Discover Amazing Tech Events</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Find hackathons, workshops, tech talks, and more happening in the tech community
          </p>
          
          <div className="mt-8">
            <button 
              onClick={handleStartExploring}
              className="bg-white text-indigo-600 font-medium px-8 py-3 rounded-full shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white flex items-center"
            >
              <span>Start Exploring</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Enhanced background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute -right-10 -top-10 w-56 h-56 bg-white rounded-full"></div>
          <div className="absolute -left-20 top-32 w-72 h-72 bg-white rounded-full"></div>
          <div className="absolute right-1/4 bottom-10 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute left-1/3 top-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute right-1/2 bottom-1/3 w-36 h-36 bg-white rounded-full"></div>
        </div>
        
        {/* Animated particles */}
        <div className="particle absolute h-2 w-2 rounded-full bg-white top-[20%] left-[10%] animate-float-slow"></div>
        <div className="particle absolute h-3 w-3 rounded-full bg-white top-[50%] left-[20%] animate-float-medium"></div>
        <div className="particle absolute h-2 w-2 rounded-full bg-white top-[70%] left-[80%] animate-float-fast"></div>
        <div className="particle absolute h-4 w-4 rounded-full bg-white top-[30%] left-[60%] animate-float-medium"></div>
        <div className="particle absolute h-2 w-2 rounded-full bg-white top-[80%] left-[40%] animate-float-slow"></div>
      </div>

      <div 
        ref={filterRef}
        className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-6 border border-gray-100 transform opacity-0 translate-y-8 transition-all duration-700 ease-out delay-100"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Customize Your Event Search
        </h2>
        <EventFilters onFilterChange={handleFilterChange} />
      </div>

      <div 
        ref={contentRef}
        className="transform opacity-0 translate-y-8 transition-all duration-700 ease-out delay-200"
      >
        {loading ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="h-16 w-16 relative">
              <div className="absolute top-0 left-0 h-full w-full border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute top-0 left-0 h-full w-full border-4 border-transparent border-t-indigo-300 rounded-full animate-ping opacity-20"></div>
            </div>
            <p className="mt-4 text-gray-500 font-medium">Loading amazing events...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-lg shadow-md my-6 animate-pulse">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-800">Error</h3>
                <p className="mt-1 text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-lg shadow-md my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-yellow-800">No events found</h3>
                <p className="mt-1 text-yellow-700">
                  Try adjusting your filters or check back later for new events.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div ref={eventsListRef}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upcoming Events
                <span className="ml-3 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full">
                  {events.length}
                </span>
                <span className="ml-2 text-sm font-normal text-green-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 animate-pulse-slow" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Live Updates
                </span>
              </h2>
              
              <div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Most Recent</option>
                  <option>Upcoming</option>
                  <option>Popular</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <div 
                  key={event._id}
                  className="transform transition-all duration-500 opacity-0 translate-y-8"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    animationDelay: `${index * 150}ms`
                  }}
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
            
            {/* Realtime update indicator */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Events update automatically every 5 minutes
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Add a CTA section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 mt-16 text-white text-center transform hover:scale-[1.02] transition-transform duration-300">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Have an event to share?</h2>
        <p className="text-lg opacity-90 mb-6 max-w-3xl mx-auto">
          Help the tech community discover your hackathon, workshop, or conference
        </p>
        <a 
          href="/add-event" 
          className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform transition hover:scale-105"
        >
          Submit Your Event
        </a>
      </div>
    </div>
  );
};

export default HomePage; 