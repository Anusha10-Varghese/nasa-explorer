// frontend/src/components/Chatbot.jsx

import React, { useState, useEffect, useRef } from 'react';
import ChatIcon from './ChatIcon.jsx'; // Import our new icon

// The "AI" brain of our chatbot
const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi')) {
        return "Hello there! I'm the NASA Explorer Bot. How can I help you explore space today?";
    }
    if (message.includes('mars') || message.includes('rover')) {
        return "The Mars Rover page is my favorite! You can use the AI search bar to type requests like 'show curiosity photos from sol 1500'. Try it out!";
    }
    if (message.includes('apod') || message.includes('picture')) {
        return "The Astronomy Picture of the Day page shows a new stunning image or video from space every day. You can even use the date picker to travel back in time and see pictures from other days!";
    }
    if (message.includes('asteroid') || message.includes('chart')) {
        return "The Asteroids page shows a chart of objects passing near Earth this week. The AI analysis gives you a quick summary, and you can click on any dot in the chart to learn more about it.";
    }
    if (message.includes('help') || message.includes('about')) {
        return "I can tell you about the Mars Rover, APOD, or Asteroids pages. Just ask me about one of them!";
    }
    
    return "I'm not quite sure about that. Try asking me about 'Mars', 'APOD', or 'asteroids'!";
};


const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    // Add the initial greeting from the bot when the component first loads
    useEffect(() => {
        setMessages([{
            text: "Welcome! Ask me about 'Mars', 'APOD', or 'asteroids' to get started.",
            sender: 'bot'
        }]);
    }, []);

    // Auto-scroll to the latest message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (!userMessage) return;

        // Add user's message to the chat
        const newMessages = [...messages, { text: userMessage, sender: 'user' }];
        setMessages(newMessages);
        setInputValue('');

        // Simulate bot "thinking" then add its response
        setTimeout(() => {
            const botResponse = getBotResponse(userMessage);
            setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
        }, 1000); // 1 second delay
    };

    return (
        <>
            <button className="chatbot-fab" onClick={toggleChat} aria-label="Open Chatbot">
                <ChatIcon />
            </button>
            <div className={`chat-window ${isOpen ? 'active' : ''}`}>
                <div className="chat-header">
                    <h3>NASA Explorer Bot</h3>
                </div>
                <div className="chat-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form className="chat-input-form" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask me something..."
                    />
                    <button type="submit" aria-label="Send Message">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
                    </button>
                </form>
            </div>
        </>
    );
};

export default Chatbot;