// File: AuraDrive/frontend/src/components/DriveAi.js (Definitive Final Version)

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useLocation } from 'react-router-dom';
import api from '../api';
import './DriveAi.css';

const AiIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </svg>
);

const DriveAi = ({ onActionExecuted, breadcrumbs }) => {
  const { scope } = useParams();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const [messages, setMessages] = useState([
    { author: 'ai', text: "Hello! I’m DriveAi. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageListRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (input.trim() === '' || isTyping) return;
    const userMessage = { author: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    try {
      const searchParams = new URLSearchParams(location.search);
      const parentId = searchParams.get('parent_id');


      const currentPath = `/${scope}/` + (breadcrumbs?.map(b => b.filename).join('/') || '');


      const response = await api.post('/api/ai/chat', {
        prompt: input,
        context: { 
          scope: scope, 
          parent_id: parentId,
          path: currentPath // 3. Send the path to the backend
        }      });


      const aiMessage = response.data;
      setMessages(prev => [...prev, aiMessage]);

      if (aiMessage.refresh_needed && onActionExecuted) {
        onActionExecuted();
      }
    } catch (error) {
      const errorMessage = { author: 'ai', text: "Sorry, I'm having trouble connecting right now." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button className="ai-fab" onClick={() => setIsOpen(!isOpen)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <AiIcon />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div className="ai-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} />
            <motion.div
              className={`ai-chat-window ${isLarge ? 'large' : ''}`}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              <div className="ai-chat-header">
                <h3>DriveAi Assistant</h3>
                <button onClick={() => setIsLarge(!isLarge)} className="ai-size-toggle">{isLarge ? 'Shrink' : 'Expand'}</button>
              </div>
              <div className="ai-message-list" ref={messageListRef}>
                {messages.map((msg, index) => (
                  <div key={index} className={`ai-message ${msg.author}`}>
                    <div className="ai-bubble">{msg.text}</div>
                  </div>
                ))}
                {isTyping && (
                  <div className="ai-message ai">
                    <div className="ai-bubble typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </div>
                )}
              </div>
              <div className="ai-input-area">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  disabled={isTyping}
                />
                <button onClick={handleSend} disabled={isTyping}>Send</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DriveAi;