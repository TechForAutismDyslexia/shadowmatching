import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import Confetti from 'react-confetti';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ImageDisplay.css';

const ItemTypes = {
  IMAGE: 'image',
};

const DraggableImage = ({ src }) => {
  const [, drag] = useDrag(() => ({
    type: ItemTypes.IMAGE,
    item: { src },
  }));

  return <img ref={drag} src={src} alt="draggable" className="img-thumbnail" style={{ width: '120px', height: '120px' }} />;
};

const DroppableImage = ({ src, expected, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.IMAGE,
    drop: (item) => onDrop(item.src, src, expected),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const backgroundColor = isOver ? '#f0e883' : 'transparent';

  return (
    <div
      ref={drop}
      className="p-2 m-2 droppable-image-container"
      style={{
        backgroundColor,
      }}
    >
      <img src={src} alt="droppable" className="img-thumbnail" style={{ width: '90px', height: '90px' }} />
    </div>
  );
};

const QuestionComponent = ({ tries, setTries, timer, setTimer }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentDisplayImage, setCurrentDisplayImage] = useState('');
  const [currentImages, setCurrentImages] = useState([]);
  const [dropResult, setDropResult] = useState(null);
  const [nextButton, setNextButton] = useState(false);
  const navigate = useNavigate();
  const gameId = '6718c148fec75b0f95aa276c';

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(`https://api.joywithlearning.com/api/shadowmatching/games/${gameId}`);
        const data = response.data;
        const item = data.items[currentPage];

        if (item) {
          // Assuming display image is directly used as `src`
          const displayImage = item.display; // Directly use the src for the display image

          // Import images for the array
          const images = await Promise.all(
            item.images.map(async (image) => ({
              ...image,
              src: (await import(`../assets/images/${image.src}.png`)).default,
            }))
          );

          setCurrentItem(item);
          setCurrentDisplayImage(displayImage); // Set the direct src for display image
          setCurrentImages(images);
          setDropResult(null); // Reset drop result state when question changes
        } else {
          navigate('/result'); // Navigate to result if no more items
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    loadData();
  }, [currentPage, gameId, navigate]);

  useEffect(() => {
    let startTime = new Date().getTime();
    let timerInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedTimer = currentTime - startTime;
      setTimer(elapsedTimer);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [setTimer]);

  const handleDrop = (draggedSrc, droppedOnSrc, expected) => {
    if (expected) {
      console.log('Correct drop', draggedSrc, droppedOnSrc);
      setTries((prevTries) => prevTries + 1);
      setDropResult('correct');
      setNextButton(true);
      setTimeout(() => {
        setDropResult(null);
      }, 5000);
    } else {
      console.log('Wrong drop', draggedSrc, droppedOnSrc);
      setTries((prevTries) => prevTries + 1);
      setDropResult('wrong');
      setTimeout(() => {
        setDropResult(null);
      }, 3000);
    }
  };

  const handleNextPage = () => {
    setCurrentDisplayImage('');
    setCurrentImages([]);
    setCurrentPage((prevPage) => prevPage + 1);
    setNextButton(false);
  };

  const arrayContainerClass = dropResult === 'correct' ? 'array-container correct' : dropResult === 'wrong' ? 'array-container wrong' : 'array-container';

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div className="container mt-5">
        <div className="menucontainer d-flex flex-row justify-content-between align-items-center p-2 my-5 rounded shadow-lg">
          <button onClick={() => navigate('/')} className="btn btn-outline-primary">Home</button>
          <h1 className="fw-bold text-primary mb-3 mx-auto">Shadow Matching</h1>
          <button className="btn btn-outline-primary">Instructions</button>
        </div>
        <div className="main-container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 text-center mb-4">
              <div className="image-display-container mt-4">
                {currentDisplayImage && <DraggableImage src={currentDisplayImage} />}
              </div>
            </div>
            <div className="col-12 col-md-8 p-5">
              <div className={`d-flex flex-wrap justify-content-center p-3 mt-5 ${arrayContainerClass}`}>
                {currentImages.map((image, index) => (
                  <DroppableImage key={index} src={image.src} expected={image.expected} onDrop={handleDrop} />
                ))}
              </div>
              {dropResult === 'correct' && <Confetti />}
            </div>
          </div>
        </div>
        <div className="col-12 text-center mt-4">
          {nextButton && (
            <button onClick={handleNextPage} className="btn btn-warning btn-lg">
              Next
            </button>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default QuestionComponent;
