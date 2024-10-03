import { useEffect, useState } from 'react';
import axiosInstance from '../../Axios';
import '../../css/poll.css'

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
const PollList = () => {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [votingStatus, setVotingStatus] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetchPolls();
    }, []);

    const fetchPolls = async () => {
        try {
            const response = await axiosInstance.get('/polls');
            setPolls(response.data.data);
            setLoading(false);
        } catch (error) {
            setError("Error fetching polls");
            setLoading(false);
        }
    };

    const handleVote = async (pollId: string, optionIndex: number) => {
        setVotingStatus(prev => ({ ...prev, [pollId]: 'voting' }));
        try {
            await axiosInstance.post(`/polls/${pollId}/vote`, { optionIndex });
            await fetchPolls(); // Refresh polls after voting
            setVotingStatus(prev => ({ ...prev, [pollId]: 'success' }));
            setTimeout(() => {
                setVotingStatus(prev => {
                    const newStatus = { ...prev };
                    delete newStatus[pollId];
                    return newStatus;
                });
            }, 2000);
        } catch (error) {
            setVotingStatus(prev => ({ ...prev, [pollId]: 'error' }));
            setTimeout(() => {
                setVotingStatus(prev => {
                    const newStatus = { ...prev };
                    delete newStatus[pollId];
                    return newStatus;
                });
            }, 2000);
        }
    };

    if (loading) return <div className="loader"></div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="poll-list-container">
            <h1>Active Polls</h1>
            <div className="poll-grid">
                {polls.map(poll => (
                    <div key={poll._id} className="poll-card">
                        <div className="poll-header">
                            <h2>{poll.title}</h2>
                            <div className="poll-meta">
                                <div className="creator">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                    <span>{poll.creator.username}</span>
                                </div>
                                <div className="end-date">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                                    className={`option ${votingStatus[poll._id] === 'voting' ? 'voting' : ''}`}
                                    onClick={() => handleVote(poll._id, idx)}
                                    disabled={!poll.isActive || votingStatus[poll._id] === 'voting'}
                                >
                                    <div className="option-header">
                                        <span className="option-text">{option.text}</span>
                                        <span className="vote-count">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                            {votingStatus[poll._id] && (
                                <div className={`status-message ${votingStatus[poll._id]}`}>
                                    {votingStatus[poll._id] === 'voting' && 'Voting...'}
                                    {votingStatus[poll._id] === 'success' && 'Vote recorded!'}
                                    {votingStatus[poll._id] === 'error' && 'Error voting'}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PollList;