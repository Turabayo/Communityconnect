import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './ChatScreen.css'; // Add CSS to style the chat

const socket = io('http://localhost:8081'); // Connect to the backend server

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Listen for messages from the server
    socket.on('chat message', (messageData: string) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    // Cleanup on unmount
    return () => {
      socket.off('chat message');
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Emit the message to the server
      socket.emit('chat message', message);
      setMessage(''); // Clear the message input
    }
  };

  return (
    <div className="chat-container">
      <h1>Real-time Chat</h1>
      <div className="messages">
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatScreen;
