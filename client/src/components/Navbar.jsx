import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLinkHovered, setActiveLinkHovered] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className={`p-2 rounded-full mr-3 shadow-md transform transition-all duration-300 group-hover:scale-110 ${scrolled ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-white'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors duration-300 ${scrolled ? 'text-white' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="transition-all duration-300">
                <span className={`font-bold text-xl tracking-tight ${scrolled ? 'text-indigo-600' : 'text-white'}`}>
                  Event
                </span>
                <span className={`font-bold text-xl tracking-tight ml-1 ${scrolled ? 'text-purple-600' : 'text-white opacity-90'}`}>
                  Aggregator
                </span>
                <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 ${scrolled ? 'bg-indigo-600' : 'bg-white'}`}></div>
              </div>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              type="button" 
              className={`hover:text-gray-200 focus:outline-none transition-all duration-300 ${scrolled ? 'text-indigo-600 hover:text-indigo-800' : 'text-white'}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block h-0.5 w-6 transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-2.5' : '-translate-y-2'} ${scrolled ? 'bg-indigo-600' : 'bg-white'}`}></span>
                <span className={`absolute block h-0.5 w-6 transition duration-200 ease-in-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'} ${scrolled ? 'bg-indigo-600' : 'bg-white'}`}></span>
                <span className={`absolute block h-0.5 w-6 transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 translate-y-2.5' : 'translate-y-2'} ${scrolled ? 'bg-indigo-600' : 'bg-white'}`}></span>
              </div>
            </button>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`group py-2 px-4 rounded-full font-medium transition-all duration-300 relative ${
                location.pathname === '/' 
                  ? `${scrolled ? 'text-white bg-indigo-600' : 'bg-white text-indigo-600 shadow-md'}`
                  : `${scrolled ? 'text-indigo-600 hover:bg-indigo-50' : 'text-white hover:bg-white/20'}`
              }`}
              onMouseEnter={() => location.pathname === '/' && setActiveLinkHovered(true)}
              onMouseLeave={() => location.pathname === '/' && setActiveLinkHovered(false)}
            >
              <span className="relative z-10 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${location.pathname === '/' && activeLinkHovered ? 'animate-bounce-slow' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </span>
              {location.pathname === '/' && (
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-current transition-all duration-300 ${activeLinkHovered ? 'w-12' : ''}`}></span>
              )}
            </Link>
            <Link 
              to="/add-event" 
              className={`group py-2 px-4 rounded-full font-medium transition-all duration-300 relative ${
                location.pathname === '/add-event' 
                  ? `${scrolled ? 'text-white bg-indigo-600' : 'bg-white text-indigo-600 shadow-md'}`
                  : `${scrolled ? 'text-indigo-600 hover:bg-indigo-50' : 'text-white hover:bg-white/20'}`
              }`}
              onMouseEnter={() => location.pathname === '/add-event' && setActiveLinkHovered(true)}
              onMouseLeave={() => location.pathname === '/add-event' && setActiveLinkHovered(false)}
            >
              <span className="relative z-10 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1.5 ${location.pathname === '/add-event' && activeLinkHovered ? 'animate-bounce-slow' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Submit Event
              </span>
              {location.pathname === '/add-event' && (
                <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-current transition-all duration-300 ${activeLinkHovered ? 'w-12' : ''}`}></span>
              )}
            </Link>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className={`pb-4 border-t ${scrolled ? 'border-gray-200' : 'border-indigo-400/30'}`}>
            <Link 
              to="/" 
              className={`flex items-center py-3 px-4 rounded-md font-medium transition-all duration-300 mt-1 ${
                location.pathname === '/' 
                  ? `${scrolled ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`
                  : `${scrolled ? 'text-indigo-600 hover:bg-indigo-50' : 'text-white hover:bg-white/20'}`
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </Link>
            <Link 
              to="/add-event" 
              className={`flex items-center py-3 px-4 rounded-md font-medium transition-all duration-300 mt-1 ${
                location.pathname === '/add-event' 
                  ? `${scrolled ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'}`
                  : `${scrolled ? 'text-indigo-600 hover:bg-indigo-50' : 'text-white hover:bg-white/20'}`
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Submit Event
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 