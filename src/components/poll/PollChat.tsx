import React, { useState, useEffect, useRef } from 'react';
import './PollWithChat.css';
import axiosInstance from '../../Axios';

interface Message {
    id: string;
    userId: string;
    username: string;
    text: string;
    timestamp: Date;
}

interface PollOption {
    text: string;
    votedBy: string[];
    votes: number;
}

interface Poll {
    _id: string;
    title: string;
    options: PollOption[];
    creator: {
        _id: string;
        username: string;
    };
    endDate: Date;
    isActive: boolean;
    totalVotes: number;
}

const PollWithChat: React.FC<{ poll: Poll }> = ({ poll }) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [votingStatus, setVotingStatus] = useState<string | null>(null);

    // Simulated user ID - in real app, get from auth context
    const currentUserId = "user123";
    const currentUsername = "CurrentUser";

    useEffect(() => {
        if (isChatOpen) {
            fetchMessages();
        }
    }, [isChatOpen]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        // Simulate API call to fetch messages
        const mockMessages: Message[] = [
            {
                id: '1',
                userId: 'user1',
                username: 'Alice',
                text: 'What do others think about option A?',
                timestamp: new Date(Date.now() - 1000000)
            },
            {
                id: '2',
                userId: 'user2',
                username: 'Bob',
                text: 'I voted for option B because...',
                timestamp: new Date(Date.now() - 500000)
            }
        ];
        setMessages(mockMessages);
    };

    const handleVote = async (optionIndex: number) => {
        setVotingStatus('voting');
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setVotingStatus('success');
            setTimeout(() => setVotingStatus(null), 2000);
        } catch (error) {
            setVotingStatus('error');
            setTimeout(() => setVotingStatus(null), 2000);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const message: Message = {
            id: Date.now().toString(),
            userId: currentUserId,
            username: currentUsername,
            text: newMessage,
            timestamp: new Date()
        };

        setMessages([...messages, message]);
        setNewMessage('');

        // Here you would typically send the message to your backend
    };

    return (
        <div className="poll-card">
            <div className="poll-header">
                <h2>{poll.title}</h2>
                <div className="poll-meta">
                    <div className="creator">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <span>{poll.creator.username}</span>
                    </div>
                    <div className="end-date">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Ends: {new Date(poll.endDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="poll-options">
                {poll.options.map((option, idx) => (
                    <button
                        key={idx}
                        className={`option ${votingStatus === 'voting' ? 'voting' : ''}`}
                        onClick={() => handleVote(idx)}
                        disabled={!poll.isActive || votingStatus === 'voting'}
                    >
                        <div className="option-header">
                            <span className="option-text">{option.text}</span>
                            <span className="vote-count">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                {option.votes}
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress"
                                style={{ width: `${(option.votes / poll.totalVotes) * 100 || 0}%` }}
                            ></div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="poll-footer">
                <div className="total-votes">
                    Total votes: {poll.totalVotes}
                </div>
                <button
                    className={`chat-toggle-btn ${isChatOpen ? 'active' : ''}`}
                    onClick={() => setIsChatOpen(!isChatOpen)}
                >
                    {isChatOpen ? 'Hide Chat' : 'Show Chat'}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                </button>
            </div>

            {isChatOpen && (
                <div className="chat-container fade-in">
                    <div className="chat-header">
                        <h3>Discussion</h3>
                        <button className="close-chat" onClick={() => setIsChatOpen(false)}>×</button>
                    </div>
                    <div className="chat-messages" ref={chatContainerRef}>
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${message.userId === currentUserId ? 'own-message' : ''}`}
                            >
                                <div className="message-header">
                                    <span className="message-username">{message.username}</span>
                                    <span className="message-time">
                                        {message.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="message-content">{message.text}</div>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleSendMessage} className="chat-input">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PollWithChat;    