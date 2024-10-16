import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Shadow1 from '../assets/images/shadow1.png';
import Shadow2 from '../assets/images/shadow2.png';
import Shadow3 from '../assets/images/shadow3.png';
import Confetti from 'react-confetti';
import 'bootstrap/dist/css/bootstrap.min.css';

const STATIC_IMAGES = [
  { name: "shadow1", src: Shadow1 },
  { name: "shadow2", src: Shadow2 },
  { name: "shadow3", src: Shadow3 }
];

const Uploading = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [imageSets, setImageSets] = useState([{
    uploadedImage: null,
    selectedImage: null
  }]);
  const [confettiVisible, setConfettiVisible] = useState(false);

  const handleImageUpload = (e, index) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      const newImageSets = [...imageSets];
      newImageSets[index].uploadedImage = { base64: base64String, name: file.name };
      setImageSets(newImageSets);
    };

    reader.readAsDataURL(file);
  };

  const handleCorrectImageClick = (index, imageName) => {
    const newImageSets = [...imageSets];
    newImageSets[index].selectedImage = STATIC_IMAGES.find(img => img.name === imageName).name;
    setImageSets(newImageSets);
  };

  const handleAddImageSet = () => {
    setImageSets([...imageSets, {
      uploadedImage: null,
      selectedImage: null
    }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || imageSets.some(set => !set.uploadedImage || !set.selectedImage)) {
      alert("Please fill all fields and select the correct image for each set.");
      return;
    }

    const data = {
      name: name,
      items: imageSets.map(set => ({
        display: set.uploadedImage.base64,
        images: STATIC_IMAGES.map(img => ({
          src: img.name,
          expected: img.name === set.selectedImage
        }))
      }))
    };

    try {
      console.log("Creating game:", data);
      const response = await axios.post('http://localhost:5000/api/games', data);
      console.log("Game created successfully:", response.data);
      alert("Game created successfully!");
      navigate('/home');
      setConfettiVisible(true);
      setTimeout(() => setConfettiVisible(false), 5000); // Confetti disappears after 5 seconds
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Error creating game.");
    }
  };

  return (
    <div className="container mt-5">
  {confettiVisible && <Confetti />}
  <div className="menucontainer d-flex flex-row justify-content-between align-items-center p-2 my-5 rounded shadow-lg">
    <button className="btn btn-outline-primary">Home</button>
    <h1 className="fw-bold text-primary mb-3 mx-auto">Shadow Matching</h1>
    <button className="btn btn-outline-primary">Instructions</button>
  </div>

  <div className="main-container d-flex justify-content-center">
    <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: "600px" }}>
      <div className="form-floating mb-3 mt-5">
        <input
          type="text"
          id="gameName"
          name="gameName"
          className="form-control"
          value={name}
          placeholder="Game Name"
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="gameName">Game Name:</label>
      </div>

      {imageSets.map((set, index) => (
        <div key={index} className="mb-5">
          <h3 className="text-center">Upload Image {index + 1}:</h3>
          <div className="d-flex justify-content-center">
            <input
              type="file"
              accept="image/*"
              className="form-control mb-2"
              onChange={(e) => handleImageUpload(e, index)}
              required
              style={{ maxWidth: "400px" }}
            />
          </div>
          {set.uploadedImage && (
            <div className="mb-3 text-center">
              <img
                src={set.uploadedImage.base64}
                alt={`Uploaded ${index + 1}`}
                className="img-thumbnail"
                style={{ width: '150px', height: '150px' }}
              />
            </div>
          )}
          <div>
            <h4 className="text-center">Select the correct image:</h4>
            <div className="d-flex justify-content-center gap-3">
              {STATIC_IMAGES.map((img, imgIndex) => (
                <div
                  key={imgIndex}
                  className={`card ${set.selectedImage === img.name ? 'border-primary' : ''}`}
                  style={{ cursor: 'pointer', width: '110px' }}
                  onClick={() => handleCorrectImageClick(index, img.name)}
                >
                  <img
                    src={img.src}
                    alt={img.name}
                    className="card-img-top"
                    style={{ width: '100px', height: '100px' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-center mb-3">
        <button type="button" className="btn btn-primary me-2" onClick={handleAddImageSet}>
          <i className="bi bi-plus-circle me-1"></i> Add More Images
        </button>
        <button type="submit" className="btn btn-success">
          <i className="bi bi-check-circle me-1"></i> Create Game
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default Uploading;
