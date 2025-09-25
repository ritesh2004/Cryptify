import axios from "axios";

//----------------------- Post Message -----------------------//

export const postMessage = async (senderId, receiverId, message, token) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/chat/create`, {
            senderId,
            receiverId,
            message
        },{
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};