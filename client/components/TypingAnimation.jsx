// components/TypingAnimation.js
import React, { useState, useEffect, } from 'react';
import TypeWriter from 'react-native-typewriter';

const TypingAnimation = () => {
  const [curText, setCurText] = useState(0);

  useEffect(() => {
    let timeoutId;
    const interval = setInterval(() => {
      setCurText((prevText) => (prevText === 0 ? 1 : prevText === 1 ? 2 : 0));

      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        clearInterval(interval); // Clear interval to prevent overlapping
      }, 2000);

    }, curText === 0 ? 2000 : curText === 1 ? 3000 : 5000); // Change interval based on curText value

    // Clear the interval on component unmount to avoid memory leaks
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [curText]); // Re-run effect whenever curText changes

  return (
    <>
      {curText === 0 ? 
        (<TypeWriter typing={1} className="text-gray-100">Keep Voices Close.</TypeWriter>):
      curText == 1 ?
        (<TypeWriter typing={1} className="text-gray-100 text-align-center">Your Digital Legacy.</TypeWriter>):
      (<TypeWriter typing={1} className="text-gray-100 text-align-center">Preserve Memories, Share Stories, Forever Together.</TypeWriter>)
      }
    </>

  )
}

export default TypingAnimation
