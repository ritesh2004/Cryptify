import { createContext, useState } from "react";

const SockContext = createContext(null);

export default SockContext;

export const SockProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    return (
        <SockContext.Provider value={{ socket, setSocket }}>
            {children}
        </SockContext.Provider>
    )
}