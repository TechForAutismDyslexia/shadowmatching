import React, { useEffect } from 'react';
import './Result.css';
import axios from 'axios';

export default function Result({ tries, timer }) {
  useEffect(() => {
    async function sendData() {
      try {
        if (tries === 0|| timer === 0) {
          return;
        }
        const response = await axios.post('https://jwlgamesbackend.vercel.app/api/caretaker/sendgamedata', {
          gameId: 4,
          tries: tries,
          timer: timer,
          status: true,
        });
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }
    sendData();
  }, []);

  return (
    <div className='main container mt-5 flex justify-content-center align-items-center'>
      <h1>Result Page</h1>
      <p>The number of tries : {tries}</p>
      <p>The time taken : {(timer / 1000)} seconds</p>
    </div>
  );
}
