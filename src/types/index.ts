export interface Option {
    id: number;
    text: string;
}

export interface Poll {
    id: number;
    question: string;
    options: Option[];
    chat: ChatMessage[];
}

export interface ChatMessage {
    id: number;
    pollId: number;
    text: string;
    timestamp: string;
}