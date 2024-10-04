import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";


const SocketContext = createContext<Socket | null>(null)
export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_BASE_URL.replace('/api/', ''))
        setSocket(newSocket)

        return () => {
            newSocket.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}