import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import QuestionComponent from './Components/Imagedisplay';
import Result from './Components/Result';
import { useState } from 'react';
function App() {
  const [tries, setTries] = useState(0);
  const [timer, setTimer] = useState(0);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuestionComponent setTries={setTries} setTimer={setTimer} />} />
        <Route path="/result" element={<Result tries={tries} timer={timer} />} />
      </Routes>
    </Router>
  );
}

export default App;
