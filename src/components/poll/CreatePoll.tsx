import React, { useState } from 'react';
import usePollStore from '../../store/usePollStore';
import useUserStore from '../../store/useUserStore';
import axiosInstance from '../../Axios';
import { useNavigate } from 'react-router-dom';

interface PollOption {
    text: string;
}

interface Poll {
    data: {
        title: string;
        options: PollOption[];
        creator: string;
        endDate: string;
        isActive: boolean;
    }

}

const CreatePoll: React.FC = () => {
    const [question, setQuestion] = useState<string>('');
    const [options, setOptions] = useState<string[]>(['', '']);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [endDate, setEndDate] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate()
    const addPoll = usePollStore(state => state.addPoll);
    const user = useUserStore(state => state);

    const handleAddOption = () => {
        if (options.length < 6) {
            setOptions([...options, '']);
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleRemoveOption = (index: number) => {
        if (options.length <= 2) return;
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!question.trim()) {
            setError('Poll question is required.');
            return;
        }

        const filteredOptions = options.filter(opt => opt.trim() !== '');
        if (filteredOptions.length < 2) {
            setError('At least two valid options are required.');
            return;
        }

        if (!endDate) {
            setError('End date is required.');
            return;
        }

        const endDateObj = new Date(endDate);
        if (endDateObj <= new Date()) {
            setError('End date must be in the future.');
            return;
        }

        setLoading(true);

        try {
            const response = await axiosInstance.post<Poll>('/polls/createPoll', {
                title: question,
                options: filteredOptions.map(option => ({ text: option })),
                creator: user.userId,
                userName: user.userName,
                endDate: endDateObj.toISOString(),
                isActive: true
            });

            if (response.status === 201) {
                const createdPoll = response.data;
                console.log("craetedPoll =>", createdPoll)
                addPoll(createdPoll.data.title, createdPoll.data.options.map(option => option.text));
                setSuccess(true);
                setQuestion('');
                setOptions(['', '']);
                setEndDate('');
                navigate('/')
                
            } else {
                setError('Failed to create poll. Please try again.');
            }
        } catch (err) {
            console.error('Error creating poll:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    console.log(usePollStore(state => state.polls))

    return (
        <div className="create-poll-container">
            <div className="poll-card">
                <div className="poll-header">
                    <h1>Create a New Poll</h1>
                    <p>Set up your question, add options, and choose when the poll ends</p>
                </div>

                <form onSubmit={handleSubmit} className="poll-form">
                    <div className="form-group">
                        <label htmlFor="question">Poll Question</label>
                        <input
                            id="question"
                            type="text"
                            placeholder="What would you like to ask?"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <div className="options-header">
                            <label>Options</label>
                            <span className="options-counter">{options.length}/6 options</span>
                        </div>
                        <div className="options-list">
                            {options.map((option, index) => (
                                <div key={index} className="option-item">
                                    <input
                                        type="text"
                                        placeholder={`Option ${index + 1}`}
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                    />
                                    {options.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveOption(index)}
                                            className="remove-option-btn"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleAddOption}
                            className="add-option-btn"
                            disabled={options.length >= 6}
                        >
                            + Add Option
                        </button>
                    </div>

                    <div className="form-group">
                        <label htmlFor="endDate">End Date</label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">Poll created successfully!</div>}

                    <button
                        type="submit"
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Creating Poll...' : 'Create Poll'}
                    </button>
                </form>

                <div className="poll-footer">
                    <p>Polls are active until their end date</p>
                </div>
            </div>
        </div>
    );
};

export default CreatePoll;
