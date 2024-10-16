import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState('');
  const navigate = useNavigate();

  // Fetch games from the API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/games');
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  // Handle change in dropdown selection
  const handleGameChange = (e) => {
    const gameId = e.target.value;
    setSelectedGameId(gameId);
    localStorage.setItem('selectedGameId', gameId); // Store selected game ID in localStorage
  };

  // Handle Start button click
  const handleStartClick = () => {
    if (selectedGameId) {
      navigate('/'); // Navigate to the homepage or another route
    } else {
      alert('Please select a game to start.');
    }
  };

  return (
    <div className="container mt-4 d-flex flex-column align-items-center">
  {/* <div className="menucontainer d-flex flex-row justify-content-between align-items-center p-2 my-5 rounded shadow-lg w-100" style={{ maxWidth: '600px' }}>
    <button onClick={() => navigate('/')} className="btn btn-outline-primary">Home</button>
    <h1 className="fw-bold text-primary mb-3 mx-auto">Shadow Matching</h1>
    <button className="btn btn-outline-primary">Instructions</button>
  </div> */}
  
  <div className="main-container w-100 d-flex flex-column align-items-center">
    <h1 className="text-center">Select a Game</h1>

    <div className="mb-3 col-md-6 d-flex flex-column align-items-center">
      <select
        id="gameSelect"
        className="form-select w-100 mt-2"
        value={selectedGameId}
        onChange={handleGameChange}
        style={{ maxWidth: '300px' }}
      >
        <option value="">Select a game</option>
        {games.map(game => (
          <option key={game._id} value={game._id}>
            {game.name}
          </option>
        ))}
      </select>
    </div>

    <div className="d-flex gap-2 mt-3 mb-3">
      <button
        className="btn btn-warning"
        onClick={handleStartClick}
        disabled={!selectedGameId}
      >
        Start
      </button>
      <button onClick={() => navigate('/upload')} className="btn btn-success">
        Upload
      </button>
    </div>
  </div>
</div>

  );
};

export default Home;
