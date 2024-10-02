import { create } from 'zustand';

interface UserState {
    userId: string | null;
    userEmail: string | null;
    userName: string | null;
    setUser: (action: SetUserAction) => void;
    clearUser: () => void;
    getUser: () => UserState;
    isLoggedIn: () => boolean;
}

// Define action types for updating user data
export enum SetUserActionType {
    UserId,
    Email,
    Name
}

// Define action types
type SetUserAction =
    | { type: SetUserActionType.UserId; value: string }
    | { type: SetUserActionType.Email; value: string }
    | { type: SetUserActionType.Name; value: string };


const useUserStore = create<UserState>((set, get) => {

    const storedUser = localStorage.getItem('user');
    const initialState = storedUser ? JSON.parse(storedUser) : {
        userId: null,
        userEmail: null,
        userName: null,
    };

    return {
        ...initialState,
        setUser: (action: SetUserAction) => {
            console.log("action in setUser =>", action);
            switch (action.type) {
                case SetUserActionType.UserId:
                    set({ userId: action.value });
                    break;
                case SetUserActionType.Email:
                    set({ userEmail: action.value });
                    break;
                case SetUserActionType.Name:
                    set({ userName: action.value });
                    break;
            }
            // Update local storage
            localStorage.setItem('user', JSON.stringify(get())); // Save entire user state to local storage
        },
        clearUser: () => {
            set({ userId: null, userEmail: null, userName: null });
            localStorage.removeItem('user'); // Clear user data from local storage
        },
        getUser: () => get(),
        isLoggedIn: () => !!get().userId, // Check if user is logged in based on userId
    };
});

export default useUserStore;
