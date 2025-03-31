import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">CuriosityTracker</Link>
      </div>
      <ul className="nav-links">
        <li className={location.pathname === '/' ? 'active' : ''}>
          <Link to="/">Dashboard</Link>
        </li>
        <li className={location.pathname === '/add' ? 'active' : ''}>
          <Link to="/add">Record Activity</Link>
        </li>
        <li className={location.pathname === '/entries' ? 'active' : ''}>
          <Link to="/entries">Journal</Link>
        </li>
        <li className={location.pathname === '/stats' ? 'active' : ''}>
          <Link to="/stats">Analytics</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
