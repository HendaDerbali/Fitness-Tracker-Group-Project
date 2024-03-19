import React from 'react'
import Logout from '../components/Logout';
import { useState, useEffect } from 'react';

export const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['red', 'green', 'blue'];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [colors.length]);

  function Colorize(name) {
    const color = colors[colorIndex];
    return <span style={{ color }}>{name}</span>;
  }

  return (
    <div className='d-flex flex-row justify-content-center'><p className='display-1 fw-bold pt-5 text-center'>Welcome, {Colorize(user?.firstName)} {Colorize(user?.lastName)}</p> <Logout className=' ms-5 m-5'/></div>
  )
}

export default Home;
