// File: AuraDrive/frontend/src/components/WelcomeAnimation.js

import React from 'react';
import { motion } from 'framer-motion';

const WelcomeAnimation = () => {
  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        style={{
          fontSize: '3rem',
          color: 'white',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
      >
        Welcome to AIDrive
      </motion.h1>
    </motion.div>
  );
};

export default WelcomeAnimation;