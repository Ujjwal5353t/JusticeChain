import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'File FIR', path: '/file-fir', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Track Status', path: '/status', icon: 'M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { name: 'Resources', path: '/resources', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
    { name: 'Contact', path: '/contact', icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
  ];

  return (
    <>
      {/* Government Header */}
      <div className="bg-orange-600 text-white py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center text-sm font-medium">
            <span>भारत सरकार | Government of India</span>
          </div>
        </div>
      </div>

      {/* Official Header */}
      <div className="bg-white border-b-4 border-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Government Emblem */}
              <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                  <path d="M12 4.5L4.5 8v7.5c0 4.155 2.885 7.305 7.5 8.25 4.615-.945 7.5-4.095 7.5-8.25V8L12 4.5z" fill="white"/>
                  <circle cx="12" cy="12" r="3" fill="#ff9933"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-900">Justice Chain</h1>
                <p className="text-sm text-gray-600">डिजिटल एफआईआर सिस्टम | Digital FIR System</p>
                <p className="text-xs text-blue-800">Ministry of Home Affairs, Government of India</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-semibold text-blue-900">Emergency Helpline</p>
                <p className="text-lg font-bold text-red-600">100</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-blue-900">Women Helpline</p>
                <p className="text-lg font-bold text-red-600">1091</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-blue-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'text-orange-400 border-b-2 border-orange-400'
                      : 'text-white hover:text-orange-200'
                  }`}
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden w-full flex justify-between items-center">
              <span className="text-white font-medium">Navigation</span>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-orange-200 p-2"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-800 border-t border-blue-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? 'text-orange-400 bg-blue-700'
                      : 'text-white hover:text-orange-200 hover:bg-blue-700'
                  }`}
                >
                  <svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;