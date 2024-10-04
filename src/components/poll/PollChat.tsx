import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../../Axios';
import '../../css/poll.css'
import { useSocket } from '../../context/SocketContext';

interface PollChatProps {
    pollId: string;
    userId: string | null;
    username: string | null;
    isVisible: boolean;
    onClose: () => void;
}

interface Message {
    _id: string;
    content: string;
    sender: {
        username: string;
        _id: string;
    };
    pollId: string;
    timestamp?: Date;
}

const PollChat: React.FC<PollChatProps> = ({ pollId, userId, username, isVisible, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [typingUsers, setTypingUsers] = useState<{ [key: string]: string }>({});
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<{ [key: string]: number }>({});
    const debouncedEmitTyping = useRef<number>();

    const socket = useSocket();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isVisible) {
            fetchMessages();
        }
    }, [isVisible, pollId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (socket) {
            socket.emit('joinPoll', pollId);

            socket.on('receiveMessage', (messageData: Message) => {
                console.log("after message =>", messageData);
                console.log("in messages state =>", messages);

                setMessages((prevMessages) => [...prevMessages, messageData]);
                // Clear typing indicator for the user who sent the message
                if (messageData.sender._id) {
                    setTypingUsers((prev) => {
                        const updated = { ...prev };
                        delete updated[messageData.sender._id];
                        return updated;
                    });
                }
            });

            socket.on('userTyping', (data) => {
                const { userId, username } = data;
                if (userId && userId !== socket.id) {
                    setTypingUsers((prev) => ({ ...prev, [userId]: username }));

                    // Clear previous timeout if exists
                    if (typingTimeoutRef.current[userId]) {
                        window.clearTimeout(typingTimeoutRef.current[userId]);
                    }

                    // Set new timeout
                    typingTimeoutRef.current[userId] = window.setTimeout(() => {
                        setTypingUsers((prev) => {
                            const updated = { ...prev };
                            delete updated[userId];
                            return updated;
                        });
                    }, 3000); // Remove typing indicator after 3 seconds of no updates
                }
            });

            socket.on('userStopTyping', (data) => {
                const { userId } = data;
                if (userId) {
                    setTypingUsers((prev) => {
                        const updated = { ...prev };
                        delete updated[userId];
                        return updated;
                    });

                    if (typingTimeoutRef.current[userId]) {
                        window.clearTimeout(typingTimeoutRef.current[userId]);
                        delete typingTimeoutRef.current[userId];
                    }
                }
            });

            return () => {
                socket.off('receiveMessage');
                socket.off('userTyping');
                socket.off('userStopTyping');

                // Clear all timeouts
                Object.values(typingTimeoutRef.current).forEach(timeout =>
                    window.clearTimeout(timeout)
                );
                typingTimeoutRef.current = {};
            };
        }
    }, [socket, pollId]);

    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/messages/${pollId}`);
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Failed to load messages. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetMessage = (value: string) => {
        setNewMessage(value);

        if (!socket || !userId || !username) return;

        if (debouncedEmitTyping.current) {
            window.clearTimeout(debouncedEmitTyping.current);
        }

        if (value.trim()) {
            debouncedEmitTyping.current = window.setTimeout(() => {
                socket.emit('typing', { pollId, userId, username });
            }, 300);
        } else {

            socket.emit('stopTyping', { pollId, userId });
        }
    };

    const handleSendMessage = async () => {
        if (!socket || !newMessage.trim() || !userId || !username) return;

        try {
            // Stop typing when sending message
            socket.emit('stopTyping', { pollId, userId });
            await axiosInstance.post(`/messages/${pollId}/${userId}`, {
                content: newMessage,
                username,
            });

            const newMsg = {
                pollId: pollId,
                message: newMessage,
                senderId: userId,
                username: username
            };

            socket.emit('sendMessage', { ...newMsg });

            setNewMessage('');


            // if (response.data.message) {
            //     setMessages(prevMessages => [...prevMessages, response.data.message]);
            // }

        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message. Please try again.');
        }
    };

    if (!isVisible) return null;

    return (
        <div className="poll-chat-overlay" onClick={onClose}>
            <div className="poll-chat-container" onClick={e => e.stopPropagation()}>
                <div className="poll-chat-header">
                    <h3>Poll Discussion</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="poll-chat-messages">
                    {isLoading ? (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <p>{error}</p>
                            <button onClick={fetchMessages}>Retry</button>
                        </div>
                    ) : messages.length === 0 ? (
                        <p className="no-messages">No messages yet. Start the conversation!</p>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`message-wrapper ${msg.sender._id === userId ? 'own-message' : 'other-message'}`}
                            >
                                <div className="message">
                                    <p className="sender-name">
                                        {msg.sender._id === userId ? 'You' : msg.sender.username}
                                    </p>
                                    <p className="message-content">{msg.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef}></div>
                </div>

                {/* Typing Indicator */}
                {Object.keys(typingUsers).length > 0 && (
                    <div className="typing-indicator">
                        {Object.values(typingUsers).join(', ')}
                        {Object.keys(typingUsers).length > 1 ? ' are typing...' : ' is typing...'}
                    </div>
                )}

                <div className="poll-chat-input">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => handleSetMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default PollChat;