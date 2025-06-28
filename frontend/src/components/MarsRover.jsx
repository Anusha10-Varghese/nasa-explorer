// frontend/src/components/MarsRover.jsx

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner.jsx';

const rovers = {
    curiosity: ["FHAZ", "RHAZ", "MAST", "CHEMCAM", "MAHLI", "MARDI", "NAVCAM"],
    opportunity: ["FHAZ", "RHAZ", "NAVCAM", "PANCAM", "MINITES"],
    spirit: ["FHAZ", "RHAZ", "NAVCAM", "PANCAM", "MINITES"],
};

const MarsRover = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [proTip, setProTip] = useState('');
  const [searchQuery, setSearchQuery] = useState('curiosity photos from sol 1000');
  
  // Step 1: Create state to hold the user's sorting preference
  const [sortBy, setSortBy] = useState('sol'); // 'sol' or 'earth_date'

  const handleAiSearch = async (e) => { e.preventDefault(); setLoading(true); setError(null); setProTip(''); setPhotos([]); const query = searchQuery.toLowerCase(); const foundRover = Object.keys(rovers).find(r => query.includes(r)); const solMatch = query.match(/\d+/); const foundSol = solMatch ? parseInt(solMatch[0], 10) : 1000; const allCameras = rovers[foundRover || 'curiosity'].map(c => c.toLowerCase()); const foundCamera = allCameras.find(c => query.includes(c)); if (!foundRover) { setError("I couldn't figure out which rover you want! Try 'curiosity', 'opportunity', or 'spirit'."); setLoading(false); return; } try { const response = await axios.get('/api/mars-rover', { params: { rover: foundRover, sol: foundSol, ...(foundCamera && { camera: foundCamera.toUpperCase() }) } }); if (response.data.photos.length === 0) { setError(`I couldn't find any photos for ${foundRover} on sol ${foundSol}.`); if (foundSol > 3000 && foundRover === 'curiosity') { setProTip(`Pro Tip: Sol ${foundSol} is very high for Curiosity. Most photos are from sols 0-3000. Try a lower number!`); } else if (!foundCamera) { setProTip(`Pro Tip: You didn't specify a camera. Maybe try adding 'with mast camera' to your search?`); } } else { setPhotos(response.data.photos); } } catch (err) { setError('An error occurred while fetching photos.'); } finally { setLoading(false); } };

  useEffect(() => { handleAiSearch({ preventDefault: () => {} }); }, []);

  // Step 2: Create a memoized, sorted list of photos.
  // This recalculates ONLY when the original `photos` array or the `sortBy` state changes.
  const sortedPhotos = useMemo(() => {
    const sortablePhotos = [...photos]; // Make a copy to avoid changing original state
    if (sortBy === 'sol') {
      return sortablePhotos.sort((a, b) => a.sol - b.sol);
    }
    if (sortBy === 'earth_date') {
      return sortablePhotos.sort((a, b) => new Date(b.earth_date) - new Date(a.earth_date));
    }
    return photos;
  }, [photos, sortBy]);

  return (
    <div className="page-container">
      <h2>Mars Rover Photos</h2>
      <div className="ai-search-container">
        <h3>AI-Powered Search</h3>
        <p>Try typing things like "spirit photos on sol 100" or "curiosity with mast camera on day 2000"</p>
        <form onSubmit={handleAiSearch}>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tell me what you want to see..."
          />
        </form>
      </div>
      
      {loading && <LoadingSpinner />}
      {error && <div className="error-message">{error} {proTip && <p><strong>{proTip}</strong></p>}</div>}
      
      {/* Step 3: Add the Sort By dropdown to the UI */}
      {/* It only shows up if there are photos to display */}
      {photos.length > 0 && !loading && (
        <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
          <label htmlFor="sort-by" style={{ marginRight: '10px', fontWeight: 'bold' }}>Sort by:</label>
          <select 
            id="sort-by"
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} // Updates the sort state
            className="filters"
          >
            <option value="sol">Martian Day (Sol)</option>
            <option value="earth_date">Earth Date (Newest First)</option>
          </select>
        </div>
      )}
      
      <div className="photo-gallery">
        {/* Step 4: Map over the new `sortedPhotos` array for rendering */}
        {sortedPhotos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <img src={photo.img_src.replace('http://', 'https://')} alt={`Mars Rover photo`} />
            <p>{photo.camera.full_name} (Sol: {photo.sol} | Date: {photo.earth_date})</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default React.memo(MarsRover);