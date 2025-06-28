// frontend/src/App.jsx

import React, { Suspense, lazy } from 'react';
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner.jsx';
import Chatbot from './components/Chatbot.jsx';
import BackToTopButton from './components/BackToTopButton.jsx'; // Import the new component

const APOD = lazy(() => import('./components/APOD.jsx'));
const MarsRover = lazy(() => import('./components/MarsRover.jsx'));
const NeoWs = lazy(() => import('./components/NeoWs.jsx'));

function App() {
  return (
    <>
      <header className="app-header">
        <Link to="/" className="logo">NASA Explorer</Link>
        <nav className="app-nav">
          <NavLink to="/">Picture of the Day</NavLink>
          <NavLink to="/mars-rover">Mars Rover</NavLink>
          <NavLink to="/neows">Asteroids</NavLink>
        </nav>
      </header>

      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<APOD />} />
            <Route path="/mars-rover" element={<MarsRover />} />
            <Route path="/neows" element={<NeoWs />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="app-footer">
        <p>❤️ NASA Data Explorer ❤️</p>
      </footer>

      {/* Global components that appear on every page */}
      <BackToTopButton />
      <Chatbot />
    </>
  );
}

export default App;