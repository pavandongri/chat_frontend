import React, { useEffect, useRef, useState } from 'react';
import Header from "./components/Header"

import io from 'socket.io-client';
const socket = io('http://localhost:3005');
const { v4: uuidv4 } = require('uuid');


function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  useEffect(() => {
    const name = uuidv4()
    setUsername(name)

    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    const msgObj = { text: message, sender: username };
    if (message) {
      socket.emit('chat message', msgObj);
    }
    setMessage('');
  };

  return (
    <div>
      <Header />

      {
        messages?.length > 0 &&
        <div className="chat-container">
          {messages.map((msg, index) => (
            <div className={msg.sender === username ? 'msg-sent' : 'msg-received'} key={index + Date.now()}>
              <p >{msg.text}</p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      }

      <form className='msg-form' onSubmit={sendMessage}>
        <div className='msg-input-container'>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
}

export default App;