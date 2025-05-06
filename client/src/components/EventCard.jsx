import { format } from 'date-fns';
import { useState } from 'react';

const EventCard = ({ event }) => {
  const { name, date, type, college, location, description, link } = event;
  const [isHovered, setIsHovered] = useState(false);
  
  const formattedDate = format(new Date(date), 'PPP');
  
  // Map event types to colors
  const typeColors = {
    Hackathon: 'bg-purple-100 text-purple-800 border-purple-200',
    Workshop: 'bg-blue-100 text-blue-800 border-blue-200',
    Webinar: 'bg-green-100 text-green-800 border-green-200',
    Conference: 'bg-orange-100 text-orange-800 border-orange-200',
    'Tech Talk': 'bg-red-100 text-red-800 border-red-200',
    'Career Fair': 'bg-yellow-100 text-yellow-800 border-yellow-200'
  };
  
  const typeGlowColors = {
    Hackathon: 'shadow-[0_0_15px_rgba(168,85,247,0.35)]',
    Workshop: 'shadow-[0_0_15px_rgba(59,130,246,0.35)]',
    Webinar: 'shadow-[0_0_15px_rgba(34,197,94,0.35)]',
    Conference: 'shadow-[0_0_15px_rgba(249,115,22,0.35)]',
    'Tech Talk': 'shadow-[0_0_15px_rgba(239,68,68,0.35)]',
    'Career Fair': 'shadow-[0_0_15px_rgba(234,179,8,0.35)]'
  };
  
  const typeColor = typeColors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  const typeGlow = isHovered ? (typeGlowColors[type] || '') : '';
  
  return (
    <div 
      className={`backdrop-blur-sm bg-white/90 rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 group ${isHovered ? 'transform -translate-y-2 ' + typeGlow : 'hover:shadow-xl hover:border-indigo-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">{name}</h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${typeColor} border transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
            {type}
          </span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="flex items-center text-gray-600 group-hover:text-indigo-500 transition-colors duration-300">
            <div className={`bg-indigo-50 p-2 rounded-full mr-3 transition-all duration-300 ${isHovered ? 'bg-indigo-100 scale-110' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-indigo-600 transition-all duration-300 ${isHovered ? 'rotate-12' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-medium">{formattedDate}</span>
          </div>
          
          <div className="flex items-center text-gray-600 group-hover:text-indigo-500 transition-colors duration-300">
            <div className={`bg-indigo-50 p-2 rounded-full mr-3 transition-all duration-300 ${isHovered ? 'bg-indigo-100 scale-110' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-indigo-600 transition-all duration-300 ${isHovered ? 'rotate-12' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-sm font-medium">{college}</span>
          </div>
          
          <div className="flex items-center text-gray-600 group-hover:text-indigo-500 transition-colors duration-300">
            <div className={`bg-indigo-50 p-2 rounded-full mr-3 transition-all duration-300 ${isHovered ? 'bg-indigo-100 scale-110' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-indigo-600 transition-all duration-300 ${isHovered ? 'rotate-12' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium">{location}</span>
          </div>
        </div>
        
        <div className="mt-4 mb-5">
          <p className="text-gray-700 leading-relaxed h-14 overflow-hidden">{description}</p>
        </div>
        
        {link && (
          <div className="pt-3 border-t border-gray-100">
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 group-hover:shadow-glow relative overflow-hidden"
            >
              <span className="relative z-10">Visit Event Website</span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ml-2 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              
              {/* Animated gradient overlay */}
              <div 
                className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-700 to-indigo-700 transition-opacity duration-500 opacity-0 ${isHovered ? 'opacity-100' : ''}`} 
                style={{
                  background: 'linear-gradient(90deg, rgba(109,40,217,1) 0%, rgba(79,70,229,1) 100%)'
                }}
              ></div>
            </a>
          </div>
        )}
        
        {/* Animated corner decoration - appears on hover */}
        <div className={`absolute top-0 right-0 h-16 w-16 transition-all duration-300 ease-in-out ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-r-[40px] border-t-indigo-500 border-r-transparent rounded-bl-lg"></div>
          <div className="absolute top-2 right-2 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 