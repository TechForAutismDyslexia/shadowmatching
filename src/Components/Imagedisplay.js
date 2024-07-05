import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import Confetti from 'react-confetti';
import 'bootstrap/dist/css/bootstrap.min.css';
import questions from '../assets/game.json'; // Import questions data
import './ImageDisplay.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

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
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentDisplayImage, setCurrentDisplayImage] = useState('');
  const [currentImages, setCurrentImages] = useState([]);
  const [dropResult, setDropResult] = useState(null); // Add state to track drop result
  const [nextButton, setNextButton] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const loadImages = async () => {
      const currentData = questions[currentQuestion];
      const displayImage = await import(`../assets/images/${currentData.display}.png`);
      const images = await Promise.all(
        currentData.images.map(async (image) => ({
          ...image,
          src: (await import(`../assets/images/${image.src}.png`)).default,
        }))
      );
      setCurrentDisplayImage(displayImage.default);
      setCurrentImages(images);
      setIsCorrect(false); // Reset correctness state when question changes
      setDropResult(null); // Reset drop result state when question changes
    };

    loadImages();
  }, [currentQuestion]);

  useEffect(() => {
    let startTime = new Date().getTime();
    let timerInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const elapsedTimer = currentTime - startTime;
      setTimer(elapsedTimer);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  const handleDrop = (draggedSrc, droppedOnSrc, expected) => {
    if (expected) {
      setTries((prevTries) => prevTries + 1);
      setIsCorrect(true);
      setNextButton(true);
      setDropResult('correct');
      setTimeout(() => {
        setIsCorrect(false);
        setDropResult(null);
      }, 5000);
    } else {
      setTries((prevTries) => prevTries + 1);
      setDropResult('wrong');
      setTimeout(() => {
        setDropResult(null);
      }, 3000); // Update drop result
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    setCurrentDisplayImage('');
    setCurrentImages([]);
    setNextButton(false);
    if (questions[nextQuestion]) {
      setCurrentQuestion(nextQuestion);
    } else {
      setNextButton(true);
      navigate('/result');
    }
  };

  const arrayContainerClass = dropResult === 'correct' ? 'array-container correct' : dropResult === 'wrong' ? 'array-container wrong' : 'array-container';

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <div className="container mt-5">
        <div className="main-container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 text-center mb-4">
              <div className="image-display-container mt-4">
                <DraggableImage src={currentDisplayImage} />
              </div>
            </div>
            <div className="col-12 col-md-8 p-5">
              <div className={`d-flex flex-wrap justify-content-center p-3 mt-5 ${arrayContainerClass}`}>
                {currentImages.map((image, index) => (
                  <DroppableImage key={index} src={image.src} expected={image.expected} onDrop={handleDrop} />
                ))}
              </div>
              {isCorrect && <Confetti />}
            </div>
          </div>
        </div>
        <div className="col-12 text-center mt-4">
          {nextButton && (questions[currentQuestion + 1] ? ( // Only show the "Next" button if drop is correct and there are more questions
            <button onClick={handleNextQuestion} className="btn btn-warning btn-lg">
              Next
            </button>) : (
              <button onClick={() => navigate('/result')} className="btn btn-warning btn-lg">
                View Result
              </button>
            )
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default QuestionComponent;
