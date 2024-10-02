import { create } from 'zustand';

interface UserState {
    userId: number | null;
    userEmail: string | null;
    userName: string | null;
    setUser: (action: SetUserAction) => void;
    clearUser: () => void;
    getUser: () => UserState;
    isLoggedIn: () => boolean;
}

export enum SetUserActionType {
    UserId,
    Email,
    Name
}

type SetUserAction =
    | { type: SetUserActionType.UserId; value: number }
    | { type: SetUserActionType.Email; value: string }
    | { type: SetUserActionType.Name; value: string };

// Creating the store
const useUserStore = create<UserState>((set, get) => ({
    userId: null,
    userEmail: null,
    userName: null,
    setUser: (action: SetUserAction) => {
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
    },
    clearUser: () => set({ userId: null, userEmail: null, userName: null }),
    getUser: () => get(),
    isLoggedIn: () => !!get().userId,
}));

export default useUserStore;
