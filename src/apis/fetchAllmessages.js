import axios from "axios";

//----------------------- Fetch All Messages -----------------------//

export const fetchAllMessages = async (senderId, receiverId, afterTime, token) => {
    try {
        const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/chat/get?after=${afterTime}`, {
            senderId,
            receiverId
        },{
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            }
        });
        // console.log("response", response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};