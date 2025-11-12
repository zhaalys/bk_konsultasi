'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RotatingText({
  texts = [],
  mainClassName = '',
  staggerFrom = 'first',
  initial = { y: '100%' },
  animate = { y: 0 },
  exit = { y: '-120%' },
  staggerDuration = 0.025,
  splitLevelClassName = '',
  transition = { type: 'spring', damping: 30, stiffness: 400 },
  rotationInterval = 2000,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [texts.length, rotationInterval]);

  const currentText = texts[currentIndex] || texts[0];

  const splitText = (text) => {
    return text.split('').map((char, index) => ({
      char: char === ' ' ? '\u00A0' : char,
      index,
    }));
  };

  const chars = splitText(currentText);

  return (
    <span className={mainClassName}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={false}
          className="inline-flex"
        >
          {chars.map((item, charIndex) => {
            const staggerIndex = staggerFrom === 'last' 
              ? chars.length - 1 - charIndex 
              : charIndex;

            return (
              <span
                key={`${currentIndex}-${charIndex}`}
                className={splitLevelClassName}
              >
                <motion.span
                  initial={initial}
                  animate={animate}
                  exit={exit}
                  transition={{
                    ...transition,
                    delay: staggerIndex * staggerDuration,
                  }}
                  className="inline-block"
                >
                  {item.char}
                </motion.span>
              </span>
            );
          })}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

