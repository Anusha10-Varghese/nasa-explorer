// frontend/src/components/NeoWs.jsx

import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
// Step 1: Import the click handler helper and other necessary parts
import { getElementAtEvent } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import LoadingSpinner from './LoadingSpinner.jsx';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const AiSummary = ({ dataPoints }) => {
    const summary = useMemo(() => { if (!dataPoints || dataPoints.length === 0) { return { text: "No asteroid data available to analyze for this week." }; } const hazardousCount = dataPoints.filter(p => p.is_hazardous).length; const largest = dataPoints.reduce((max, p) => (p.x > max.x ? p : max), dataPoints[0]); const closest = dataPoints.reduce((min, p) => (p.y < min.y ? p : min), dataPoints[0]); let text = `This week, ${dataPoints.length} near-earth objects will pass by. `; text += `${hazardousCount} are classified as potentially hazardous. `; text += `The largest is ${largest.name}, at an estimated ${largest.x.toFixed(2)} km wide. `; text += `The closest will be ${closest.name}, missing us by ${Math.round(closest.y).toLocaleString()} km.`; return { text }; }, [dataPoints]);
    return ( <div className="ai-summary"> <p><strong>AI Analysis:</strong> {summary.text}</p> </div> );
};

const NeoWs = () => {
  const [allNeos, setAllNeos] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Step 2: Create a ref to hold a reference to the chart instance
  const chartRef = useRef();

  useEffect(() => {
    const fetchNeos = async () => { setLoading(true); setError(null); const today = new Date(); const startDate = today.toISOString().split('T')[0]; const endDate = new Date(new Date().setDate(today.getDate() + 7)).toISOString().split('T')[0]; try { const response = await axios.get('/api/neows', { params: { start_date: startDate, end_date: endDate } }); const neosByDate = response.data.near_earth_objects; const dataPoints = Object.values(neosByDate).flat().map(neo => ({ x: neo.estimated_diameter.kilometers.estimated_diameter_max, y: parseFloat(neo.close_approach_data[0].miss_distance.kilometers), name: neo.name.replace(/[()]/g, ''), is_hazardous: neo.is_potentially_hazardous_asteroid, })); setAllNeos(dataPoints); setChartData({ datasets: [{ label: 'Non-Hazardous', data: dataPoints.filter(p => !p.is_hazardous), backgroundColor: 'rgba(54, 162, 235, 0.6)', }, { label: 'Potentially Hazardous', data: dataPoints.filter(p => p.is_hazardous), backgroundColor: 'rgba(255, 99, 132, 0.8)', pointRadius: 6, }], }); } catch (err) { setError('Failed to fetch Near-Earth Objects data.'); } finally { setLoading(false); } };
    fetchNeos();
  }, []);

  const chartOptions = { responsive: true, maintainAspectRatio: false, scales: { x: { title: { display: true, text: 'Estimated Max Diameter (km)' } }, y: { title: { display: true, text: 'Miss Distance (km)' } }, }, plugins: { tooltip: { callbacks: { label: (context) => { const dataPoint = context.raw; return `${dataPoint.name}: Size ${dataPoint.x.toFixed(3)} km, Miss Dist ${Math.round(dataPoint.y).toLocaleString()} km`; } } } } };

  // Step 3: Create the function to handle clicks on the chart
  const handleChartClick = (event) => {
    if (!chartRef.current) return;

    const element = getElementAtEvent(chartRef.current, event);
    
    if (element.length > 0) { // Check if a dot was actually clicked
      const datasetIndex = element[0].datasetIndex;
      const pointIndex = element[0].index;
      const clickedPoint = chartData.datasets[datasetIndex].data[pointIndex];
      
      const googleSearchUrl = `https://www.google.com/search?q=asteroid+${encodeURIComponent(clickedPoint.name)}`;
      window.open(googleSearchUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="page-container">
      <h2>Near-Earth Objects (Next 7 Days)</h2>
      {loading && <LoadingSpinner />}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && <AiSummary dataPoints={allNeos} />}
      <p>This chart plots asteroids passing by Earth. <strong>Click on any dot to learn more about it.</strong></p>
      <div className="chart-container">
        {chartData && (
          // Step 4: Attach the ref and the onClick handler to the Scatter component
          <Scatter 
            ref={chartRef}
            options={chartOptions} 
            data={chartData} 
            onClick={handleChartClick}
          />
        )}
      </div>
    </div>
  );
};
export default React.memo(NeoWs);