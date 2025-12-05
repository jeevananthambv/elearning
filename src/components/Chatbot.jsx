import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Hello! 👋 I\'m your learning assistant. How can I help you today?', time: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Knowledge base for the chatbot
    const knowledgeBase = {
        greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
        help: ['help', 'what can you do', 'how to use', 'guide'],
        videos: ['video', 'lecture', 'watch', 'youtube', 'tutorial'],
        materials: ['material', 'pdf', 'document', 'download', 'notes', 'ppt', 'slides'],
        subjects: ['data structure', 'programming', 'dbms', 'database', 'algorithm', 'operating system', 'network'],
        contact: ['contact', 'email', 'phone', 'reach', 'message'],
        about: ['about', 'faculty', 'professor', 'teacher', 'who'],
        thanks: ['thank', 'thanks', 'great', 'awesome', 'helpful']
    };

    const responses = {
        greetings: [
            'Hello! How can I assist you with your learning today? 📚',
            'Hi there! Ready to help you find study materials and videos! 🎓',
            'Hey! What would you like to learn about today?'
        ],
        help: [
            'I can help you with:\n\n📹 Finding video lectures\n📄 Locating study materials\n📧 Contact information\n👨‍🏫 Information about the faculty\n\nJust ask me anything!',
        ],
        videos: [
            'We have video lectures on various topics! 🎬\n\nYou can:\n• Browse all videos at /videos\n• Filter by subject like Data Structures, Programming, DBMS, etc.\n• Each video has a YouTube player for easy viewing\n\nWould you like me to help you find a specific topic?',
        ],
        materials: [
            'We have study materials in various formats! 📚\n\n• PDF documents\n• PowerPoint presentations\n• Word documents\n\nVisit /materials to browse and download. You can filter by category and file type!',
        ],
        subjects: [
            'We cover these subjects:\n\n📊 Data Structures\n💻 Programming (OOP)\n🗄️ Database Management (DBMS)\n🔢 Algorithms\n⚙️ Operating Systems\n🌐 Computer Networks\n\nWhich subject interests you?',
        ],
        contact: [
            'You can reach the faculty through:\n\n📧 Email: madhankumar.c@university.edu\n📱 Phone: +91 79048 63245\n🏛️ Office: Room 301, CS Building\n⏰ Hours: Mon-Fri, 10 AM - 5 PM\n\nOr use the contact form at /contact!',
        ],
        about: [
            'Prof. Madhankumar C is a Computer Science faculty member specializing in programming and data structures.\n\nVisit /about to learn more about their research, publications, and teaching experience!',
        ],
        thanks: [
            'You\'re welcome! Happy learning! 🎓',
            'Glad I could help! Feel free to ask anytime! 😊',
            'My pleasure! Good luck with your studies! 📚'
        ],
        default: [
            'I\'m not sure about that. Could you try rephrasing your question?\n\nI can help with:\n• Video lectures\n• Study materials\n• Contact information\n• Subject queries',
            'Hmm, I didn\'t quite understand. Try asking about videos, materials, or specific subjects!',
        ]
    };

    const getResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();

        for (const [category, keywords] of Object.entries(knowledgeBase)) {
            for (const keyword of keywords) {
                if (lowerMessage.includes(keyword)) {
                    const categoryResponses = responses[category];
                    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
                }
            }
        }

        return responses.default[Math.floor(Math.random() * responses.default.length)];
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message
        setMessages(prev => [...prev, { type: 'user', text: userMessage, time: new Date() }]);

        // Show typing indicator
        setIsTyping(true);

        // Simulate thinking delay
        setTimeout(() => {
            const botResponse = getResponse(userMessage);
            setMessages(prev => [...prev, { type: 'bot', text: botResponse, time: new Date() }]);
            setIsTyping(false);
        }, 800 + Math.random() * 700);
    };

    const quickQuestions = [
        'What videos are available?',
        'How to download materials?',
        'Contact information',
        'Available subjects'
    ];

    const handleQuickQuestion = (question) => {
        setInput(question);
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle chatbot"
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chat Window */}
            <div className={`chatbot-window ${isOpen ? 'open' : ''}`}>
                <div className="chatbot-header">
                    <div className="chatbot-header-info">
                        <span className="chatbot-avatar">🤖</span>
                        <div>
                            <h4>Learning Assistant</h4>
                            <span className="chatbot-status">● Online</span>
                        </div>
                    </div>
                    <button className="chatbot-close" onClick={() => setIsOpen(false)}>✕</button>
                </div>

                <div className="chatbot-messages">
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.type}`}>
                            {msg.type === 'bot' && <span className="message-avatar">🤖</span>}
                            <div className="message-content">
                                <p style={{ whiteSpace: 'pre-line' }}>{msg.text}</p>
                                <span className="message-time">
                                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="chat-message bot">
                            <span className="message-avatar">🤖</span>
                            <div className="message-content typing">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Quick Questions */}
                {messages.length <= 2 && (
                    <div className="quick-questions">
                        {quickQuestions.map((q, i) => (
                            <button key={i} onClick={() => handleQuickQuestion(q)}>
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                <form className="chatbot-input" onSubmit={handleSend}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        disabled={isTyping}
                    />
                    <button type="submit" disabled={!input.trim() || isTyping}>
                        ➤
                    </button>
                </form>
            </div>
        </>
    );
};

export default Chatbot;
