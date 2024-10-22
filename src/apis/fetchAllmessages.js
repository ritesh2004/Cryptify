import axios from "axios";

//----------------------- Fetch All Messages -----------------------//

export const fetchAllMessages = async (senderId, receiverId, token) => {
    try {
        const response = await axios.post(`http://192.168.1.4:5000/api/v1/chat/get`, {
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