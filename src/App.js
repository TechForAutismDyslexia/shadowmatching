import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import QuestionComponent from './Components/Imagedisplay';
import Result from './Components/Result';
import Uploading from './Components/Uploading';
import Home from './Components/Home';
import { useState } from 'react';
function App() {
  const [tries, setTries] = useState(0);
  const [timer, setTimer] = useState(0);
  return (
    <Router basename='/games/shadowmatching'>
      <Routes>
        <Route path="/" element={<QuestionComponent setTries={setTries} setTimer={setTimer} />} />
        <Route path="/result" element={<Result tries={tries} timer={timer} />} />
        <Route path="/upload" element={<Uploading />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
