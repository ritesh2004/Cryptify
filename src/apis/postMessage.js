import axios from "axios";

//----------------------- Post Message -----------------------//

export const postMessage = async (senderId, receiverId, message, token) => {
    try {
        const response = await axios.post("http://192.168.1.4:5000/api/v1/chat/create", {
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