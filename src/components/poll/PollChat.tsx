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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const socket = useSocket()

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

    // real time updation
    useEffect(() => {
        if (socket) {

            socket.emit('joinPoll', pollId);

            socket.on('receiveMessage', (messageData) => {
                setMessages((prevMessage) => [...prevMessage, messageData])
            })
            return () => {
                socket.off('receiveMessage')
            }
        }
    })

    const fetchMessages = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axiosInstance.get(`/messages/${pollId}`);
            console.log("res -->", response.data)
            setMessages(response.data.messages || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
            setError('Failed to load messages. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {

        if(!socket){
            console.log("not socket");
            return 
        }

        if (!newMessage.trim() || !userId || !username) return;

        try {
            await axiosInstance.post(`/messages/${pollId}/${userId}`, {
                content: newMessage,
                username,
            });

            const newMsg = {
                pollId: pollId,
                message: newMessage,
                senderId: userId,
                username: username
            }

            socket?.emit('sendMessage', { ...newMsg })

            setNewMessage('');
            fetchMessages();
            console.log("stat mesage =>",messages);
            
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

                <div className="poll-chat-input">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
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