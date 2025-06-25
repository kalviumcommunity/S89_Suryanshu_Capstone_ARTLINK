import { useState } from 'react';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';
import './AiAssistant.css';
import './AiAssistantBubbles.css';

const AiAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Send user message to external Artlink Chatbot API
    try {
      const res = await fetch('https://artlink-chatbot.onrender.com/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      const aiResponse = {
        type: 'artlink-bot',
        content: data.reply || 'Sorry, I could not generate a response.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      setMessages(prev => [...prev, {
        type: 'artlink-bot',
        content: 'There was an error connecting to Artlink Bot.',
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div className="ai-assistant-container">
      <div className="chat-header">
        <FaRobot className="robot-icon" />
        <h2>Artlink Bot</h2>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message-bubble ${message.type === 'user' ? 'bubble-user' : 'bubble-bot'}`}> 
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-timestamp">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about art career advice..."
          className="message-input"
        />
        <button type="submit" className="send-button artistic-send">
          <FaPaperPlane style={{ transform: 'rotate(-20deg)', fontSize: '1.3em' }} />
        </button>
      </form>
    </div>
  );
};

export default AiAssistant;
