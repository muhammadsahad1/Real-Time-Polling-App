// src/store/usePollStore.ts
import { create } from 'zustand';
import { io } from 'socket.io-client';
import { Poll, ChatMessage } from '../types';

interface PollState {
    polls: Poll[];
    addPoll: (question: string, options: string[]) => void;
    sendMessageToPollChat: (pollId: number, message: string) => void;
    subscribeToPolls: (callback: (polls: Poll[]) => void) => void;
}

const socket = io(import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api/');

const usePollStore = create<PollState>((set) => ({
    polls: [],

    addPoll: (question: string, options: string[]) => {
        const newPoll: Poll = {
            id: Date.now(),
            question,
            options: options.map((text, index) => ({ id: index, text })),
            chat: []
        };
        socket.emit('newPoll', newPoll);
    },

    sendMessageToPollChat: (pollId: number, message: string) => {
        const newMessage: ChatMessage = {
            id: Date.now(),
            pollId,
            text: message,
            timestamp: new Date().toISOString(),
        };
        socket.emit('sendMessage', newMessage);
    },

    subscribeToPolls: (callback) => {
        socket.on('polls', (polls) => {
            set({ polls });
            callback(polls);
        });

        socket.on('pollUpdated', (poll) => {
            set((state) => {
                const updatedPolls = state.polls.map(p => p.id === poll.id ? poll : p);
                return { polls: updatedPolls };
            });
        });
    }
}));

export default usePollStore;
